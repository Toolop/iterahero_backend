const axios = require("axios");
const fs = require("fs");

const image = fs.readFileSync("test.jpg", {
    encoding: "base64"
});


axios({
    method: "POST",
    url: "https://detect.roboflow.com/cnn-melon/3",
    params: {
        api_key: "scvUwcOaTuhifPhPoqVI"
    },
    data: image,
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
})
.then(function(response) {
    let condition = "";
    let num_con = 0;
    let get = response.data['predictions'];
    for (i in get){
        if(i == 0){
            if(get[i]['class'] ==  "daun kuning"){
                num_con = 3;
            }
            else if(get[i]['class'] == "bercak"){
                num_con = 2;
            }
            else if(get[i]['class'] == "daun sehat"){
                num_con = 1;
            }
        }else{
            if(get[i]['class'] == "daun kuning" && num_con <= 3){
                condition = "daun kuning"
                break;
            }
            else if(get[i]['class'] == "bercak" && num_con <= 2){
                num_con = 3;
                condition = "bercak"
            }
            else if(get[i]['class'] == "daun sehat" && num_con <= 1){
                num_con = 2;
                condition = "daun sehat"
            }
        }
    }

    if(condition ==  "daun kuning"){
        num_con = 3;
    }
    else if(condition == "bercak"){
        num_con = 2;
    }
    else if(condition == "daun sehat"){
        num_con = 1;
    }
})
.catch(function(error) {
    console.log(error.message);
});