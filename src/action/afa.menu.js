/**
 * Created by zcn on 2017/7/5.
 */
var items = [
    {
        id: 'main',
        name: 'AFAIDE',
        type: 'group',
        children: [
            {
                id: 'main/about',
                name: 'About',
                type: 'group',
                img: "/assets/image/nav-folder.png",
                children: [
                    {
                        id: 'main/about/test1',
                        name: 'test1',
                        type: 'group',
                        children: [
                            {
                                id: 'main/about/test1/test1_t1',
                                img: "/assets/image/nav-folder.png",
                                name: 'test1_t1',
                                type: 'action'
                            }
                        ]
                    },
                    {
                        id: 'main/about/test2',
                        name: 'test2',
                        type: 'group'
                    }
                ]
            },
            {
                id: 'main/preference',
                name: 'Preference',
                type: 'action',
                shortcut: 'Ctrl+A'
            }
        ]
    },
    {
        id: 'file',
        name: 'File',
        type: 'group'
    },
    {
        id: 'edit',
        name: 'Edit',
        type: 'group'
    },
    {
        id: 'view',
        name: 'View',
        type: 'group'
    }
];

module.exports = {
    config:{},
    items:items
};