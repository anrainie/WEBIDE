const key = 'afa';
const parseToPath = (url, type) => {
    let path, name, p, level;
    p = url.split('|');
    switch (type) {
        case 'bcpt':
            path = p.join('/') + '.bcpt';
            name = p[p.length - 1] + '.bcpt';
            level = p[0];
            switch (level) {
                case 'bank':
                case 'platform':
                    path = '/functionModule/businessComponent/' + path;
                    break;
                default :
                    path = '/functionModule/businessComponent/projects/' + path;
            }
            break;
        case 'fc':
            path = '/' + param1.split('|').join('/') + '/flow/flowConfig.fc';
            name = 'flowConfig.fc';
            break;
        case 'java':
            level = p[1];
            path = p.join('/') + '.java';
            name = p.join('.') + '.java';
            switch (level) {
                case 'bank':
                case 'platform':
                    path = '/functionModule/technologyComponent/' + level + '/componentSourceCode/' + path;
                    break;
                default :
                    path = '/functionModule/technologyComponent/projects/' + level + '/componentSourceCode/' + path;
            }

            break;
    }
    return {
        path,
        name,
        resId: type
    };
};

module.exports = {
    parseToPath
};