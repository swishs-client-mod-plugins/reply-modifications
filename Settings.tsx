import React from 'react';
import { RadioGroup } from '@components/settings';

export enum IncomingValues {
  DEFAULT,
  FORCE,
  SUPPRESS,
}

export enum OutgoingValues {
  DEFAULT,
  REMEMBER,
  SUPPRESS,
}

export default ({ settings }: { settings: Settings; }) => (
  <React.Fragment>
    <RadioGroup
      title='Incoming Replies (messages sent by other users)'
      value={settings.get('incoming', IncomingValues.DEFAULT)}
      onChange={({ value }) => void settings.set('incoming', value)}
      options={[{
        name: 'Default Behavior',
        desc: 'Do not change the behavior of incoming replies.',
        value: IncomingValues.DEFAULT,
      }, {
        name: 'Force Mentions',
        desc: 'Force all incoming replies to your messages to ping you.',
        value: IncomingValues.FORCE,
      }, {
        name: 'Suppress Mentions',
        desc: 'Force all incoming replies to your messages to not ping you.',
        value: IncomingValues.SUPPRESS,
      }]}
    />
    <RadioGroup
      title='Outgoing Replies (messages sent by you)'
      value={settings.get('outgoing', OutgoingValues.DEFAULT)}
      onChange={({ value }) => void settings.set('outgoing', value)}
      options={[{
        name: 'Always On',
        desc: 'This is the default behavior for outgoing replies.',
        value: OutgoingValues.DEFAULT,
      }, {
        name: 'Remember Choice',
        desc: 'Save your last choice and use that as the outgoing behavior.',
        value: OutgoingValues.REMEMBER,
      }, {
        name: 'Always Off',
        desc: 'Always toggle off outgoing replies.',
        value: OutgoingValues.SUPPRESS,
      }]}
    />
  </React.Fragment>
);
