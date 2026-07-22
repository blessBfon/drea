
export default{
    title:"drea",
    description:"A RuleForge validation system for JavaScript and Typescript.",
    head:[
        ['link',{ rel:'icon', href:'/favicon-2.ico'}],
        ['link',{ rel:'shortcut icon', href:'/favicon-3.ico'}]
    ],
    themeConfig:{
        nav:[
            { text:'Home', link:'/'  },
            { text:'GitHub', link:'https://github.com/blessBfon/drea'},
            { text:'NPM', link:'https://www.npmjs.com/package/drea'}
        ],
        logo:'/img/drea-logo-3.png',
        siteTitle:'drea',
        sidebar:[
            {   
                text:'Documentation',
                items:[
                    { text:'Getting Started', link:'/'},
                    { text:'Whats new', link:'/whats-new-in-v4'},
                    { text:'Why drea', link:'/why-drea'},
                    { text:'Features',link:'/features'},
                    { text:'Installation',link:'/installation'},
                    { text:'Quick Start', link:'/quick-start'},
                    { text:'Guard System', link:'/guard-system'},
                    { text:'Error Classes', link:'/error-classes'},
                    { text:'validateEntry', link:'/validateEntry',},
                    { text:'None type', link:'/none-skip-validation'},
                    { text:'validateMany', link:'/validateMany'},
                    { text:'Built-in Validators', link:'/built-in-validators' },
                    { text:'URL', link:'/url'},
                    { text:'Normalizer', link:'/normalizer'},
                    { text:"CustomClassicModel", link:"/customclassicmodel",
                        items:[
                            { text:'validate()', link:'/validate'},
                            { text:'nestvalidate()', link:"/nestvalidate"},
                            { text:"Runtime schema mutation", link:'/extend--remove--swap'}
                        ]
                    },
                    { text:'File Validation', link:'/file-validation-in-nestvalidate'},
                    { text:"Error Reference", link:"/error-reference"},
                    { text:"CHANGELOG", link:"/changelog"}
                ]
            }
        ],
        socialLinks:[
            { icon:'gtihub', link:'https://github.com/blessBfon/drea' }
        ]
    },
    css:'./theme/custom.css'
}