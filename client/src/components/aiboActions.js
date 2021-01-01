const data = [
  { action: 'approach_object', text: 'Approach Object', arguments:
    [
      { name: 'TargetType', text: 'Target Type', values: ['aibo', 'aibone', 'dice', 'pinkball'] },
    ],
  },
  { action: 'approach_person', text: 'Approach Person', arguments:
    [
      { name: 'DistanceFromTarget', text: 'Distance from Target', input: 0.4, min: 0.4, max: 2.0, units: 'meters' },
    ],
  },
  { action: 'change_posture', text: 'Change Posture', arguments:
    [
      { name: 'FinalPosture', text: 'Posture', values: [
        'back',
        'crouch',
        'down',
        'down_and_lengthen_behind',
        'down_and_shorten_behind',
        'sit_and_raise_both_hands',
        'sit',
        'sleep',
        'stand',
        'stand_straight',
      ],
      },
    ],
  },
  { action: 'chase_object', text: 'Chase Object', arguments:
    [
      { name: 'TargetType', text: 'Target Type', values: ['aibo', 'aibone', 'dice', 'pinkball'] },
    ],
  },
  { action: 'chase_person', text: 'Chase Person', arguments:
    [
      { name: 'ChasingDurationMsec', text: 'Chasing Duration', input: 0, min: 0, max: 360000, units: 'milliseconds' },
    ],
  },
  { action: 'explore', text: 'Explore', arguments:
    [
      { name: 'Duration', text: 'Duration', input: 0, min: 0, max: 260, units: 'seconds' },
    ],
  },
  { action: 'find_object', text: 'Find Object', arguments:
    [
      { name: 'TargetType', text: 'Target Type', values: ['aibo', 'aibone', 'dice', 'pinkball'] },
    ],
  },
  { action: 'find_person', text: 'Find Person', arguments: [] },
  { action: 'get_close_to_object', text: 'Get Close to Object', arguments:
    [
      { name: 'TargetType', text: 'Target Type', values: ['aibone', 'dice', 'pinkball'] },
      { name: 'Distance', text: 'Distance', input: 0.1, min: 0.1, max: 0.3, units: 'meters' },
    ],
  },
  { action: 'kick_object', text: 'Kick Object', arguments:
    [
      { name: 'TargetType', text: 'Target Type', values: ['pinkball'] },
      { name: 'KickMotion', text: 'Kick Motion', values: ['kick', 'heading'] },
    ],
  },
  { action: 'move_along_circle', text: 'Move Along Circle', arguments:
    [
      { name: 'WalkSpeed', text: 'Walk Speed', values: [0, 1, 2] },
      { name: 'Radius', text: 'Radius', input: 0.5, min: 0.5, max: 3.0, units: 'meters' },
      { name: 'MovingAngle', text: 'Angle', input: 0, min: 0, max: 1080, units: 'degrees' },
      { name: 'Direction', text: 'Direction', values: ['left', 'right'] },
    ],
  },
  { action: 'move_direction', text: 'Move in Direction', arguments:
    [
      { name: 'WalkSpeed', text: 'Walk Speed', values: [0, 1, 2] },
      { name: 'TargetDistance', text: 'Target Distance', input: 0.5, min: 0.5, max: 6.0, units: 'meters' },
      { name: 'TargetAngle', text: 'Angle', input: 0, min: -180, max: 180, units: 'degrees' },
    ],
  },
  { action: 'move_forward', text: 'Move Forward', arguments:
    [
      { name: 'WalkSpeed', text: 'Walk Speed', values: [0, 1, 2] },
      { name: 'WalkDistance', text: 'Walk Distance', input: 0, min: -6, max: 6, units: 'meters' },
    ],
  },
  { action: 'move_head', text: 'Move Head', arguments:
    [
      { name: 'Azimuth', text: 'Azimuth', input: 0, min: -80, max: 80, units: 'degrees' },
      { name: 'Elevation', text: 'Elevation', input: 0, min: -40, max: 40, units: 'degrees' },
      { name: 'Velocity', text: 'Velocity', input: 10, min: 10, max: 80, units: 'degrees/second' },
    ],
  },
  { action: 'move_sideways', text: 'Move Forward', arguments:
    [
      { name: 'WalkSpeed', text: 'Walk Speed', values: [0, 1, 2] },
      { name: 'WalkDistance', text: 'Walk Distance', input: 0, min: -6, max: 6, units: 'meters' },
    ],
  },
  { action: 'move_to_position', text: 'Move to Position', arguments:
    [
      { name: 'TargetType', text: 'Target Type', values: ['charging_station', 'greeting_spot', 'toilet'] },
    ],
  },
  { action: 'play_bone', text: 'Play with Bone', arguments:
    [
      { name: 'Category', text: 'Category', values: ['holdMouth'] },
    ],
  },
  { action: 'play_motion', text: 'Play Motion', arguments:
    [
      { name: 'Category', text: 'Category', values:
      [
        { Category: 'agree', description: 'Nod' },
        { Category: 'bad', description: 'Feel bad' },
        { Category: 'bark', description: 'Bark loudly' },
        { Category: 'beckon', Mode: 'BODY_LEFT|BODY_RIGHT', description: 'Beckon with front paw' },
        { Category: 'belch', description: 'Belch' },
        { Category: 'bentBack', description: 'Bend back' },
        { Category: 'breath', description: 'Wheeze slightly' },
        { Category: 'curious', description: 'Show signs of interest' },
        { Category: 'dance', description: 'dance' },
        { Category: 'drawInOnesChin', description: 'Tucks its chin in' },
        { Category: 'dreaming', description: 'Dream' },
        { Category: 'friendly', description: 'Behave happy' },
        { Category: 'friendlyPolite', description: 'Make "Let\'s play!" movement' },
        { Category: 'gasp', description: 'Open and closes its mouth repeatedly' },
        { Category: 'halfAsleep', description: 'Make "half asleep" movement' },
        { Category: 'handsUp', description: 'Raise both its fron paws' },
        { Category: 'happyOrNot', description: 'Make excited movement' },
        { Category: 'heading', Mode: 'SPACE_LEFT|SPACE_RIGHT', description: 'Make a header' },
        { Category: 'highFive', Mode: 'BODY_LEFT|BODY_RIGHT', description: 'Give a high five' },
        { Category: 'imFriendly', description: 'Behave playful' },
        { Category: 'jiggle', description: 'Shake itself' },
        { Category: 'kiss', description: 'Kiss' },
        { Category: 'lickBody', Mode: 'BODY_LEFT|BODY_RIGHT', description: 'Groom' },
        { Category: 'lookAroundHead', description: 'Glance left and right' },
        { Category: 'lookOver', description: 'Look closer' },
        { Category: 'marking', Mode: 'BOY|GIRL', escription: 'Go for a pee' },
        { Category: 'nodHead', description: 'Nod twice' },
        { Category: 'openMouth', description: 'Open its mouth a little and closes it' },
        { Category: 'overJoyed', description: 'Be overjoyed' },
        { Category: 'paw', Mode: 'BODY_LEFT|BODY_RIGHT', description: 'Shake hands' },
        { Category: 'peace', Mode: 'SPACE_LEFT|SPACE_RIGHT', description: 'Face petulantly' },
        { Category: 'perceive', description: 'Be startled' },
        { Category: 'playBiting', description: 'Bite gently' },
        { Category: 'prettyPlease', description: 'Look through upturned eyes' },
        { Category: 'ready', description: 'Behave like it can\'t wait' },
        { Category: 'relax', description: 'Lie faced up' },
        { Category: 'restless', description: 'Be restless' },
        { Category: 'rubBack', description: 'Rub its back against the ground' },
        { Category: 'scratchFloor', description: 'Dig the ground' },
        { Category: 'scratchHead', Mode: 'HIND_LEFT|HIND_RIGHT', description: 'Scratch its head with its left back paw' },
        { Category: 'shakeHead', description: 'Behave sad' },
        { Category: 'shakeHipsBehind', description: 'Shake its butt' },
        { Category: 'shudder', description: 'Tremble slightly' },
        { Category: 'sideKick', Mode: 'FRONT_LEFT|FRONT_RIGHT', description: 'Sidefoot with left front paw' },
        { Category: 'sideUp', Mode: 'BODY_LEFT|BODY_RIGHT', description: 'Roll over left and show tummy' },
        { Category: 'sing', description: 'Sing' },
        { Category: 'sleepTalking', description: 'Talk in its sleep' },
        { Category: 'sneeze', description: 'Sneeze' },
        { Category: 'sniff', description: 'Sniff directly in front' },
        { Category: 'sniffDown', description: 'Sniff the ground left and right' },
        { Category: 'sniffUp', description: 'Sniff upward' },
        { Category: 'startled', description: 'Be surprised' },
        { Category: 'startledLittle', description: 'Be a little surprised' },
        { Category: 'stretch', description: 'Stretch itself' },
        { Category: 'swing', description: 'Swing body left and right' },
        { Category: 'touched', Mode: 'SPACE_CENTER', description: 'Open mouth and ears' },
        { Category: 'waiting', description: 'Behave bored' },
        { Category: 'washFace', description: 'Make a washing its face gesture' },
        { Category: 'whine', description: 'Whine with its head down sadly' },
        { Category: 'wiggleEar', Mode: 'BODY_BOTH', description: 'Twitch its ears' },
        { Category: 'woof', description: 'Growl and bend forward, be vigilant' },
        { Category: 'yap', description: 'Yap in a high voice' },
        { Category: 'yawn', description: 'Give a big yawn' },
      ],
      },
    ],
  },
  { action: 'play_dice', text: 'Play with Dice', arguments:
    [
      { name: 'Category', text: 'Category', values: [
        'holdMouthdICE',
        'rollDiceLeft',
        'rollDickeRight',
        'rollDicePush',
        'rollDicePull',
        'stackDice',
      ],
      },
    ],
  },
  { action: 'release_object', text: 'Release Object', arguments:
    [
      { name: 'TargetType', text: 'Target Type', values: ['aibone', 'dice'] },
    ],
  },
  { action: 'Stay', text: 'Stay', arguments:
    [
      { name: 'Duration`', text: 'Duration', input: 0, min: 0, max: 360, units: 'seconds' },
    ],
  },
  { action: 'turn_around', text: 'Turn Around', arguments:
    [
      { name: 'TurnSpeed', text: 'Turn Speed', values: [0, 1, 2] },
      { name: 'TurnAngle', text: 'Angle', input: 0, min: -180, max: 180, units: 'degrees' },
    ],
  },
];

module.exports = Object.freeze(data);
