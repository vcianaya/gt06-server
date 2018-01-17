exports.parse_data = (data)=>{
    data = data.toString('hex');
    parts.start = data.substr(0, 4);
    if (parts.start == '7878') {
        parts.length = parseInt(data.substr(4, 2), 16);
        parts.finish = data.substr(6 + parts.length * 2, 4);

        parts.protocal_id = data.substr(6, 2);                

        if (parts.protocal_id == '01') {
            parts.device_id = data.substr(8, 16);            
            parts.action = 'login_request';
        } else if (parts.protocal_id == '12') {
            parts.device_id = '';
            parts.data = data.substr(8, parts.length * 2);            
            parts.action = 'ping';
        } else if (parts.protocal_id == '13') {
            parts.device_id = '';            
            parts.action = 'heartbeat';
        } else if (parts.protocal_id == '16' || parts.protocal_id == '18') {
            parts.device_id = '';
            parts.data = data.substr(8, parts.length * 2);            
            parts.action = 'alert';
        } else {
            parts.device_id = '';            
            parts.action = 'noop';
        }
    } else {
        parts.device_id = '';        
        parts.action = 'noop';
    }
    return parts;
}