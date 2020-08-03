const SocketIO = require('socket.io');
const nircmd = require('nircmd');

const setting = require('./setting.json');

let bp;

module.exports = (server) => {
    const io = SocketIO(server, { path: '/socket.io' });

    io.on('connection', (socket) => {
        const req = socket.request;
        const ip = req.connection.remoteAddress;
        if(setting.ALLOW_IP.indexOf(ip) == -1 && setting.ALLOW_IP.indexOf(ip.replace('::ffff:', '')) == -1) {
            socket.disconnect();
            return;
        }
        console.log(`새로운 클라이언트 ${ip}가 접속하였습니다.`);

        socket.on('disconnect', () => {
            console.log(`클라이언트 ${ip}가 접속을 해제하였습니다.`);
        });
        socket.on('error', (err) => {
            console.error(err);
        });
        socket.on('msg', (data) => {
            if(bp == null) {
                bp = data;
                return;
            }
            let m_alpha = bp.alpha - data.alpha;
            let m_beta = bp.beta - data.beta;
            let m_gamma = bp.gamma - data.gamma;

            if(m_alpha <= -180) m_alpha = m_alpha + 360;
            if(m_beta <= -180) m_beta = m_beta + 360;
            if(m_gamma <= -180) m_gamma = m_gamma + 360;

            if(m_alpha >= 180) m_alpha = m_alpha - 360;
            if(m_beta >= 180) m_beta = m_beta - 360;
            if(m_gamma >= 180) m_gamma = m_gamma - 360;

            if(m_alpha > 10) console.log({ a : m_alpha , b : m_beta , g : m_gamma });
            bp = data;

            nircmd(`sendmouse move ${m_alpha * setting.CALLIBRATION} ${m_beta * setting.CALLIBRATION}`);
        });
        socket.on('click', (data) => {
            if(data == 'left') nircmd('sendmouse left click');
            if(data == 'right') nircmd('sendmouse right click');
            if(data == 'left_double') nircmd('sendmouse left dblclick');
            if(data == 'hold_click_on') nircmd('sendmouse left down');
            if(data == 'hold_click_off') nircmd('sendmouse left up');
        });
    });
}