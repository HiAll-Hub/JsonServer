import os from 'os';

export const getIPAddress = () => {
    const networkInterfaces = os.networkInterfaces();
    for (const interfaceName in networkInterfaces) {
        for (const netInterface of networkInterfaces[interfaceName]) {
            if (netInterface.family === 'IPv4' && !netInterface.internal) {
                return netInterface.address;
            }
        }
    }
    return 'localhost'; // Si no encuentra una IP, devuelve localhost
};