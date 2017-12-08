# Korrigan: Screeps Units AI (WIP)

### Rollup and code upload

Screeps Typescript Starter uses rollup to compile your typescript and upload it to a screeps server.

Move or copy `screeps.sample.json` to `screeps.json` and edit it, changing the credentials and optionally adding or removing some of the destinations.

Running `rollup -c` will compile your code and do a "dry run", preparing the code for upload but not actually pushing it. Running `rollup -c --dest main` will compile your code, and then upload it to a screeps server using the `main` config from `screeps.json`.

You can use `-cw` instead of `-c` to automatically re-run when your source code changes - for example, `rollup -cw --dest main` will automatically upload your code to the `main` configuration every time your code is changed.

Finally, there are also NPM scripts that serve as aliases for these commands in `package.json` for IDE integration. Running `npm run push-main` is equivalent to `rollup -c --dest main`, and `npm run watch-sim` is equivalent to `rollup -cw --dest sim`.

#### Important! To upload code to a private server, you must have [screepsmod-auth](https://github.com/ScreepsMods/screepsmod-auth) installed and configured!

## Run

You have to spawn yourself the creeps using the console
Get room id with 'Game.spawns['Spawn1'].room.name' (Probably "sim" in simulator)
energySource id with 'Game.spawns['Spawn1'].room.find(FIND_SOURCES)[0]['id']'

Game.spawns['Spawn1'].spawnCreep( [WORK, WORK, MOVE], 'Harvester1', { memory:{taskType: "HARVEST", taskTargetId: "74698a3a958afb4a87028d0f", taskTargetRoom: "sim", taskStateType: "MOVE", taskStateTargetId: "74698a3a958afb4a87028d0f", taskStateTargetRoom: "sim"}});

... Mmmm Ok
It doesn't seem to work very well


Work In Progress
