// IceServersHandler.js

export const IceServersHandler = (function () {
  function getIceServers(withTurn = true) {
    var iceServers = [ { urls: [ 'stun:ws-turn3.xirsys.com' ] } ];

    if (withTurn && process.env.VUE_APP_TURN_USERNAME && process.env.VUE_APP_TURN_CREDENTIAL) {
      iceServers.push({
        username: process.env.VUE_APP_TURN_USERNAME,
        credential: process.env.VUE_APP_TURN_CREDENTIAL,
        urls: [
          'turn:us-turn7.xirsys.com:80?transport=udp',
          'turn:us-turn7.xirsys.com:3478?transport=udp',
          'turn:us-turn7.xirsys.com:80?transport=tcp',
          'turn:us-turn7.xirsys.com:3478?transport=tcp',
          'turns:us-turn7.xirsys.com:443?transport=tcp',
          'turns:us-turn7.xirsys.com:5349?transport=tcp',
        ],
      });
    }

    return iceServers;
  }

  return { getIceServers: getIceServers };
})();