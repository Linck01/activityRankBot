const guildModel = require('../models/guild/guildModel.js');
const guildMemberModel = require('../models/guild/guildMemberModel.js');
const rankVoiceMember = require('../util/rankVoiceMember.js');

module.exports = (oldState, newState) => {
  return new Promise(async function (resolve, reject) {
    try {
      const member = await oldState.member;

      if (!member)
        return resolve();
      if (!member.user)
        return resolve();
      if (member.user.bot)
        return resolve();

      await guildModel.cache.load(oldState.guild);
      await guildMemberModel.cache.load(member);

      if (oldState.channel == null && newState.channel != null && newState.member != null) {
        // Join
        await rankVoiceMember.update(member,newState.channel);

      } else if (newState.channel == null && oldState.channel != null && oldState.member != null) {
        // Leave
        await rankVoiceMember.update(member,oldState.channel);

      } else {
        // Switch or mute
      }

      resolve();
    } catch (e) { reject(e); }
  });
}
