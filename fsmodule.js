const fs = require('fs');


// 파일 리스트 불러오기
exports.getFileList = function( path ){

    return new Promise( (resolve, reject) =>{ 
        
        fs.readdir(path, function(err, files){
            resolve (files);
        });
    
    } )

}


// 파일 타입 확인 함수
exports.getFileType = function( path ){

    return new Promise( (resolve, reject) =>{ 

        fs.lstat( path, (err, stats)=>{
            if(err){
                resolve( {type: 'error'} );
            }
            
            try{
            if( stats.isFile() )
                resolve( {type: 'file'} );
            else if( stats.isDirectory() )
                resolve( {type: 'directory'} );
            else
                resolve( {type: 'error'} );
            } catch {
                resolve( {type: 'error'} );
            }
        } )
        

    } )
}

