/*
	Dynamic Commands
*/

Settings.addPermissions(['info', 'wall']);

exports.commands = {

	infowall: 'dyn',
	dynwall: 'dyn',
	wall: 'dyn',
	info: 'dyn',
	dyn: function (arg, by, room, cmd) {
		var perm = (cmd in {'wall': 1, 'dynwall': 1, 'infowall': 1}) ? 'wall' : 'info';
		if (!this.can(perm) || this.roomType === 'pm') {
			if (!arg) {
				var list = Object.keys(CommandParser.dynCommands).sort().join(", ");
				if (!list) return this.pmReply(this.trad('nocmds'));
				return this.pmReply(this.trad('list') + ': ' + list);
			}
			var dcmd = toId(arg);
			if (CommandParser.dynCommands[dcmd]) {
				return this.pmReply(CommandParser.dynCommands[dcmd]);
			} else {
				return this.pmReply(this.trad('c') + ' "' + dcmd + '" ' + this.trad('notexist'));
			}
		} else {
			if (!arg) {
				var list = Object.keys(CommandParser.dynCommands).sort().join(", ");
				if (!list) return this.reply(this.trad('nocmds'));
				return this.reply(this.trad('list') + ': ' + list);
			}
			var dcmd = toId(arg);
			if (CommandParser.dynCommands[dcmd]) {
				if (perm === 'wall') return this.reply('/announce ' + CommandParser.dynCommands[dcmd]);
				return this.reply(CommandParser.dynCommands[dcmd]);
			} else {
				return this.reply(this.trad('c') + ' "' + dcmd + '" ' + this.trad('notexist'));
			}
		}
	},

	deletecommand: 'delcmd',
	delcmd: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		var dcmd = toId(arg);
		if (CommandParser.dynCommands[dcmd]) {
			delete CommandParser.dynCommands[dcmd];
			CommandParser.saveDinCmds();
			this.reply(this.trad('c') + ' "' + dcmd + '" ' + this.trad('d'));
		} else {
			this.reply(this.trad('c') + ' "' + dcmd + '" ' + this.trad('n'));
		}
	},

	setcommand: 'setcmd',
	setcmd: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		if (!CommandParser.tempVar) {
			this.reply(this.trad('notemp'));
		}
		var dcmd = toId(arg);
		var text = '';
		if (CommandParser.dynCommands[dcmd]) {
			text = this.trad('c') + ' "' + dcmd + '" ' + this.trad('modified');
		} else {
			text = this.trad('c') + ' "' + dcmd + '" ' + this.trad('created');
		}
		CommandParser.dynCommands[dcmd] = CommandParser.tempVar;
		CommandParser.saveDinCmds();
		this.reply(text);
	},

	stemp: 'temp',
	temp: function (arg, by, room, cmd) {
		if (!this.isRanked('~')) return false;
		if (arg) CommandParser.tempVar = Tools.stripCommands(arg);
		this.reply('Temp: ' + CommandParser.tempVar);
	}
};
