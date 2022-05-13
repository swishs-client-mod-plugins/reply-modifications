/* The source code below is licensed under MIT */

import Plugin from '@structures/plugin';

import { create } from '@patcher';
import { getByProps } from '@webpack';
import { Users } from '@webpack/stores';
import { Dispatcher } from '@webpack/common';
import Settings, { IncomingValues, OutgoingValues } from './Settings';

import type { MessageJSON } from 'discord-types/general';

const Patcher = create('reply-modifications');

const PendingReplies = getByProps('createPendingReply') as {
  createPendingReply: (args: { shouldMention: boolean; }) => any,
  setPendingReplyShouldMention: (_: unknown, shouldMention: boolean) => void,
};

export default class ReplyModifications extends Plugin {
  start() {
    type DispatcherType = { _dispatch(args: { message: MessageJSON, type: string; }): void; };
    Patcher.before(Dispatcher as unknown as DispatcherType, '_dispatch', (_, [{ message, type }]) => {
      if (type !== 'MESSAGE_CREATE') return;

      const currentUser = Users.getCurrentUser();
      if (!currentUser || !Array.isArray(message.mentions) || !message.referenced_message) return;

      const mentionIndex = message.mentions.findIndex(a => a.id === currentUser.id);

      switch (this.settings.get('incoming', IncomingValues.DEFAULT)) {
        case IncomingValues.FORCE:
          if (message.referenced_message.author.id === currentUser.id && mentionIndex === -1)
            message.mentions.push(message.referenced_message.author);
          break;
        case IncomingValues.SUPPRESS:
          if (message.referenced_message.author.id === currentUser.id && mentionIndex > -1)
            message.mentions.splice(mentionIndex, 1);
      }
    });

    Patcher.before(PendingReplies, 'createPendingReply', (_, [args]) => {
      switch (this.settings.get('outgoing', OutgoingValues.DEFAULT)) {
        case OutgoingValues.REMEMBER:
          args.shouldMention = this.settings.get('lastMention', true);
          break;
        case OutgoingValues.SUPPRESS:
          args.shouldMention = false;
      }
    });

    Patcher.before(PendingReplies, 'setPendingReplyShouldMention', (_, [, shouldMention]) => {
      this.settings.set('lastMention', shouldMention);
    });
  }

  stop() {
    Patcher.unpatchAll();
  }

  getSettingsPanel() {
    return Settings;
  }
}
