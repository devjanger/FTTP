const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
var path = require('path')
var mime = require('mime-types')
const session = require('express-session');
var md5 = require('md5');
const bodyParser = require("body-parser");

const fsm = require('./fsmodule.js');


const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
 
app.use(
    session({
        secret: "ilovepizza",
        resave: false,
        saveUninitialized:true
    })
);


const port = 4444;


const BasePath = 'E:\\'; // 베이스 경로 FTTP
const id = 'cefc3454779723c9c6228df6621720f7'; // fttp
const password = 'cefc3454779723c9c6228df6621720f7'; // fttp



app.get('/login', (req, res)=>{
    
    res.render('login.html');

})

app.post('/login', (req, res)=>{
    
    var pid = md5( req.body.id );
    var ppw = md5( req.body.pw );


    if( pid == id && ppw == password ){
        req.session.auth = 'verify';
        res.send(' <script>location.href="/"</script> ');
    }else
        res.send(' <script>alert("Wrong account"); location.href="/login"</script> ');


})


// 모든 / 경로에게 옵션 주기
app.use('/',function(req, res,next) {
    if( req.session.auth == undefined || req.session.auth == '' || req.session.auth == null ) {
        res.send('<script>location.href="/login"</script>');
    }else
        next(); // 그냥 넘겨주기
});

app.use(express.static(path.join(BasePath, '/')));

app.get('/', async (req, res)=>{

    
    if( req.session.auth == 'verify' ) {

        var requestPath = ( req.query.path == undefined || req.query.path == '')? '/' : req.query.path ;
        var currentPath = BasePath + requestPath;

        

        if ( currentPath.charAt( currentPath -1 ) != '\\' || currentPath.charAt( currentPath -1 ) != '/' ){
            //currentPath+='\\'; // 윈도우
            currentPath+='/'; // 리눅스
        }


        var fileList = await fsm.getFileList( currentPath ); 

        
        var dirs = []; // 디렉토리 모음
        var files = []; // 파일 모음

        
        if( fileList != undefined ){

            for( var i=0; i<fileList.length; i++ ){
                if( ( await fsm.getFileType( currentPath + fileList[i] ) ).type == 'directory' ){
                    dirs.push( fileList[i] );
                }
            }

            for( var i=0; i<fileList.length; i++ ){
                if( ( await fsm.getFileType( currentPath + fileList[i] ) ).type == 'file' ){
                    files.push( fileList[i] );
                }
            }

            res.render( 'index.html', { files, dirs, requestPath } );
        }
        else{
            res.send('<script>alert("Undefined Path!");history.back()</script>')
        }
    } else 
        res.send(' <script>location.href="/login"</script> ');

})



app.listen( port, ()=>{
    console.log('FTTP 서버 구동중');
} )
