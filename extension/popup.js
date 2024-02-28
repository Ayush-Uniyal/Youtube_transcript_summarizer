
const btn = document.getElementById("summarise");
const input_url = document.getElementById("input");
const prefix = "https://www.youtube.com/watch?v=";
const p = document.getElementById("output");
var url = "";

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var isinput = 1;
        var parent = document.getElementById("parent");
        var ele = document.createElement('h1');
        parent.appendChild(ele);
        // fetch the link if youtube is opened
        if (tabs && tabs.length > 0) {
            var taburl = tabs[0].url;
            console.log(taburl);
            try {
                if (taburl != "" && taburl.includes(prefix)) {
                    url = taburl;
                    isinput = 0;
                    console.log("send request to api with URL -> when user clicks the summarize button");
                    ele.innerHTML = "Successfully fetched!";
                    input_url.style.display = "none";
                }
            } catch (error) {
                console.log("Error:", error);
            }
        }
        
        // show input box if youtube is not open
        if (isinput == 1) {
            console.log("show input box for entering URL");
            var inputurl = '';
            var isValidURL = false; // Flag to track whether a valid URL was entered before
            input_url.addEventListener("input", function () {
                inputurl = input_url.value;
                inputurl = inputurl.trim();
                url = inputurl;
                if (inputurl.includes(prefix)) {
                    isValidURL = true; // Valid URL entered
                    ele.innerHTML = "Successfully fetched!";
                    btn.disabled = false;
                } else {
                    isValidURL = false; // Invalid URL or empty input
                    if(inputurl == ""){
                        ele.innerHTML = "empty input"; 
                    }else{
                        ele.innerHTML = "please enter valid input!"; 
                    }
            
                    btn.disabled = true; // Disable the button
                }
            });
        } 

        // Add a click event listener to the button
        btn.addEventListener("click", function () {
                if(isValidURL || isinput == 0) {
                    chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
                        // var url = tabs[0].url;
                        btn.innerHTML = "Summarizing...."
                        var xhr = new XMLHttpRequest();
                        xhr.open("GET", "http://127.0.0.1:5000/summary?url=" + url, true);
                        xhr.onload = function() {
                            var text = xhr.responseText;
                            const p = document.getElementById("output");
                            p.innerHTML = text;
                            btn.disabled = false;
                            btn.innerHTML = "Summarise";
                        }
                        xhr.send();
                    });
                }else{
                    ele.innerHTML = "please enter valid input!";
                }
        });
});

