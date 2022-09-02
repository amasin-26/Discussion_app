var queTitleNode = document.getElementById("subject");
var queBodyNode = document.getElementById("question");
var submitBtnNode = document.getElementById("submitBtn");
var dataListNode = document.getElementById("dataList");
var allRightResponseNode = document.getElementById("allRightResponse");
var toggleDisplayNode = document.getElementById("toggleDisplay");
var respondAnsNode = document.getElementById("respondAns");
var commentHolderNode = document.getElementById("commentHolder");
var pickNameNode = document.getElementById("pickName");
var pickCommentNode = document.getElementById("pickComment");
var commentBtnNode = document.getElementById("commentBtn");
var respondQueNode = document.getElementById("respondQue");
var resolveHolderNode = document.getElementById("resolveHolder");
var resNode = document.getElementById("res");
var questionSearchNode = document.getElementById("questionSearch");
var upvoteNode = document.getElementById("upvote");
var downvoteNode = document.getElementById("downvote");
var twoBoxNode = document.getElementById("twoBox");
var resolveBtnNode = document.getElementById("resolveBtn");
var newQuestionFormNode = document.getElementById('newQuestionForm');


var question = [];
var upvote = 0;
var downvote = 0;

submitBtnNode.onclick = function() {
    saveQue();
    //   console.log(queTitleNode.value);
    //   console.log(queBodyNode.value);
};

//1-b : save question on local storage;
onload();

function onload() {
    console.log('localStorageQue');

    //debugger;
    allQues(function(localStorageQue) {
        console.log(localStorageQue);
        //debugger;

        localStorageQue = localStorageQue.sort(function(currentQ, nextQ) {
            if (currentQ.upvote > nextQ.upvote) {
                return -1;
            }

            return 1;
        })

        localStorageQue = localStorageQue.sort(function(currentQ, nextQ) {
            if (currentQ.fav > nextQ.fav) {
                return -1;
            }

            return 1;
        })





        localStorageQue.forEach(function(quest) {
            // console.log(sort(quest.upvote));
            addQueToLeft(quest);
        });


    });

}

// all question from local storage

// function allQues() {
//   // debugger;

//   var allQue = localStorage.getItem("questions");
//   //console.log(allQue);
//   if (allQue) {
//     allQue = JSON.parse(allQue);
//     // console.log(allQue);
//     question = allQue;
//   } else {
//     question = [];
//   }

//   return question;
// }


function allQues(getResponse) {
    //debugger;
    var request = new XMLHttpRequest;
    request.addEventListener('load', function() {

        var body = JSON.parse(request.responseText);

        getResponse(JSON.parse(body.data));

        console.log(JSON.parse(body.data));
        var data = JSON.parse(body.data)
        question = data;


    })

    request.open('get', 'https://storage.codequotient.com/data/get');
    request.send();

}



function saveQue() {


    var que = {
        title: queTitleNode.value,
        body: queBodyNode.value,
        response: [],
        upvote: 0,
        downvote: 0,
        dateCreated: Date.now(),
        fav: 0
    };
    console.log(question);
    question.push(que);

    queOnSave(question, function() {

        addQueToLeft(que);

    });
}

function queOnSave(que, response) {

    console.log(que);
    var body = {
        data: (JSON.stringify(que))

    }

    //localStorage.setItem("questions", JSON.stringify(question));


    var request = new XMLHttpRequest();
    request.open('POST', 'https://storage.codequotient.com/data/save');
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(body));

    request.addEventListener('load', function() {
        //console.log('data: ', request.responseText);
        response()
    })



    //console.log(que);
}

// // User Story 2 : When the question form in the right pane is submitted, add a question to the left pane.
function addQueToLeft(que) {
    var divNode = document.createElement("div");
    var titleNode = document.createElement("h4");
    var bodyNode = document.createElement("h6");
    var labelNode = document.createElement("label");
    var upNode = document.createElement("label");
    var downNode = document.createElement("label");
    var fabIcon = document.createElement("i");


    titleNode.innerHTML = que.title;
    bodyNode.innerHTML = que.body;
    upNode.innerHTML = (`Upvote: ${que.upvote}`);
    downNode.innerHTML = (`Downvote: ${que.downvote}`);
    //fabIcon.innerHTML = que.fav;

    divNode.setAttribute("class", "bg");
    labelNode.setAttribute("id", que.title);
    upNode.setAttribute("class", "up");
    downNode.setAttribute("class", "down");
    fabIcon.setAttribute("class", "fas fa-star icon");





    divNode.appendChild(titleNode);
    divNode.appendChild(bodyNode);
    labelNode.appendChild(upNode);
    labelNode.appendChild(downNode);
    divNode.appendChild(labelNode);
    divNode.appendChild(fabIcon);
    dataListNode.appendChild(divNode);

    clearInput();

    divNode.onclick = onQueClick(que);



    // fabIcon.onclick = fabMarkQue(que, fabIcon,event);
    fabIcon.addEventListener('click', fabMarkQue(que, fabIcon));
    onFavLoadColor(que, fabIcon);



}

function clearInput() {
    queTitleNode.value = "";
    queBodyNode.value = "";
}

// User Story 3 : When a question box in the left pane is clicked, display the question, the response form, and the responses in the right pane. Response form contains Name & Comment field (Both are mandatory).
function addQueToRight(que) {
    var div = document.createElement("div");
    var titleNode = document.createElement("h2");
    var bodyNode = document.createElement("h4");
    var dateLabelNode = document.createElement("label");


    titleNode.innerHTML = que.title;
    bodyNode.innerHTML = que.body;

    dateCreated(que.dateCreated, dateLabelNode);
    dateLabelNode.setAttribute("class", "date");

    div.setAttribute("class", "rightDiv")


    div.appendChild(titleNode);
    div.appendChild(bodyNode);
    div.appendChild(dateLabelNode);

    respondQue.appendChild(div);

    // responses(que.response)
    commentHolderNode.style.display = "block";
}

function responses(question) {
    return function() {
        var responsesObj = {
            resName: pickNameNode.value,
            resComment: pickCommentNode.value,
        };
        saveResponses(question, responsesObj);
        addResponse(responsesObj);
    };
}

function saveResponses(upadatedQue, responsesObj) {
    allQues(function(allQue) {

        console.log("got clicked");
        var thatQue = allQue.map(function(ques) {
            console.log(upadatedQue.title);
            if (upadatedQue.title === ques.title) {
                ques.response.push(responsesObj);
            }
            return ques;
        });

        queOnSave(thatQue, function() {


            console.log(thatQue);
        });

        //localStorage.setItem("questions", JSON.stringify(thatQue));
    });

}

function addResponse(responsesObj) {
    //debugger;
    var div = document.createElement("div");
    var resTitleNode = document.createElement("h5");
    var resBodyNode = document.createElement("p");
    var hrNode = document.createElement("hr");

    resTitleNode.innerHTML = responsesObj.resName;
    resBodyNode.innerHTML = responsesObj.resComment;

    div.setAttribute("class", "commt");

    div.appendChild(resTitleNode);
    div.appendChild(resBodyNode);
    div.appendChild(hrNode);

    respondAnsNode.appendChild(div);

    pickNameNode.value = "";
    pickCommentNode.value = "";
}

function hideRightPane() {
    toggleDisplayNode.style.display = "none";
    respondQueNode.innerHTML = "";
    respondAnsNode.innerHTML = "";
}

function toShowRightOnClick() {
    allRightResponseNode.style.display = "block";
    respondQueNode.style.display = "block";
    resolveHolderNode.style.display = "block";
    respondAnsNode.style.display = "block";
    resNode.style.display = "block";
}

function onQueClick(que) {
    return function() {
        toShowRightOnClick();

        hideRightPane();
        addQueToRight(que);

        // debugger;
        que.response.forEach(function(res) {
            addResponse(res);
        });

        commentBtnNode.onclick = responses(que);
        upvoteNode.onclick = upVote(que);
        downvoteNode.onclick = downVote(que);
        //downvoteNode.onclick = downvote(que);

        resolveBtnNode.onclick = resolveQue(que);


    };
}


questionSearchNode.addEventListener("keyup", function(event) {
    queSearch(event.target.value);
    //console.log(event.target.value);
});

function queSearch(search) {
    //debugger;
    allQues(function(allque) {


        clearLeftPane();
        if (search) {
            // debugger;
            var thatQue = allque.filter(function(que) {
                if (que.title.includes(search)) {
                    //  debugger;
                    return true;
                }
            });

            if (thatQue.length) {
                allque.forEach(function(que) {
                    if (que.title.includes(search)) {
                        addQueToLeft(que);
                    }

                })
            } else {
                notFound();
            }



        } else {
            allque.forEach(function(que) {
                addQueToLeft(que);
            });
        }
    });

}

function notFound() {
    var notFoundNode = document.createElement('h2');
    notFoundNode.innerHTML = "Not Found";

    dataListNode.appendChild(notFoundNode);
}

function clearLeftPane() {
    dataListNode.innerHTML = "";
}
// Before Filtering:

// After Filtering ( If record matched)

// After Filtering( record not matched )

// User Story 7: Add a count associated with each question or each response that represents how many up-votes it has (negative numbers correspond to downvotes). Add buttons that allow the user to up and down vote questions or responses. Display questions/responses with more upvotes earlier than questions/responses with fewer upvotes.

// User Story 8: When the resolve button is clicked, remove the associated question from the question list. Make the right pane display the new question form.

// List Before resolving

// List After resolving : Resolved question removed from the list.


function upVote(question) {
    // debugger;

    return function() {
        //debugger;

        question.upvote++;
        updatedQue(question);
        updateQueUI(question);
    }
}

function downVote(question) {
    return function() {

        question.downvote++;
        //debugger;
        updatedQue(question);
        updateQueUI(question);
    }


}


function updatedQue(questions) {

    allQues(function(allQue) {


        //console.log("got clicked");
        var thatQue = allQue.map(function(ques) {
            //s console.log(upadatedQue.title);
            if (questions.title === ques.title) {
                return questions;
            }
            return ques;
        });

        queOnSave(thatQue, function() {


            console.log(thatQue);
        });

        //localStorage.setItem("questions", JSON.stringify(thatQue));
    });
}


function updateQueUI(que) {

    var divNode = document.getElementById(que.title);
    console.log(divNode.childNodes[0].innerHTML);
    divNode.childNodes[0].innerHTML = (`Upvote: ${que.upvote}`);
    divNode.childNodes[1].innerHTML = (`Downvote: ${que.downvote}`);


}


function dateCreated(date, node) {
    var totalTime = (Date.now() - date);

    //debugger;
    var second = totalTime / 1000;
    setInterval(function() {
        // console.log(second);

        second++;
        var minute = second / 60;
        var hour = minute / 60;
        var day = hour / 24;
        if (second < 60) {
            node.innerHTML = "created: " + parseInt(second) + " sec ago";

        } else if (second >= 60 && second < 3600) {
            node.innerHTML = "created: " + parseInt(minute) + " mins " + parseInt(second % 60) + " sec ago";
        } else if (second >= 3600 && second < 86400) {
            node.innerHTML = "created: " + parseInt(hour) + " hrs " + parseInt(minute % 60) + " mins " + parseInt(second % 60) + " sec ago";
        } else if (second >= 86400) {
            node.innerHTML = "created: " + parseInt(day) + " days " + parseInt(hour % 24) + " hrs " + parseInt(minute % 60) + " mins " + parseInt(second % 60) + " sec ago";;
        }
    }, 1000)

}




newQuestionFormNode.onclick = showAddQuePanel;


function resolveQue(question) {

    return function() {
        // debugger;
        console.log(question.title);
        deleteQue(question);
        showAddQuePanel();
    }
}

function deleteQue(q) {

    allQues(function(allQue) {


        console.log(allQue);
        var num = 0;
        //console.log("got clicked");
        var thatQue = allQue.map(function(ques) {
            //s console.log(upadatedQue.title);
            num++;
            if (q.title === ques.title) {
                //console.log(num - 1, num);
                // debugger;
                //return ques.pop();
                allQue.splice(num - 1, num);
            }
            //return allQue;
        });
        // debugger;
        dataListNode.innerHTML = "";

        // localStorage.setItem("questions", JSON.stringify(allQue));

        queOnSave(allQue, function() {

            allQue.forEach(function(que) {
                addQueToLeft(que);
            })
        });

    });

}





function showAddQuePanel() {
    toggleDisplayNode.style.display = "block";
    allRightResponseNode.style.display = "none";

}





function fabMarkQue(que, node, event) {
    // debugger;


    return function(event) {
        event.stopPropagation();
        if (que.fav === 0) {
            node.style.color = "#F0A500";

            que.fav = 1;
            //console.log(node);

        } else if (que.fav === 1) {

            que.fav = 0;
            node.style.color = "#203239";
        }
        console.log(que.fav);
        updatedQue(que);

    }




}


function onFavLoadColor(quest, node) {
    if (quest.fav === 1) {
        node.style.color = "#F0A500";
    } else if (quest.fav === 0) {
        node.style.color = "#203239";
    }
}