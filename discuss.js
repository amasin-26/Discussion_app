// JavaScript source code
var submitQuestionButton = document.getElementById("submitBtn");
var questionTitle = document.getElementById("subject");
var questionDescription = document.getElementById("question");
var allQuestionList = document.getElementById("dataList");
var createQuestionForm = document.getElementById("toggleDisplay");
var questionDetailContainer = document.getElementById("respondQue");
var resolveQuestionContainer = document.getElementById("resolveHolder");
var resolveQuestionButton = document.getElementById("resolveQuestion");
var responseContainer = document.getElementById("respondAns");
var commentContainer = document.getElementById("commentHolder");
var commentatorName = document.getElementById("pickName");
var comment = document.getElementById("pickComment");
var submitCommentButton = document.getElementById("commentBtn");
var searchQuestion = document.getElementById("questionSearch");
var upvoteButton = document.getElementById("upvote")
var downvoteButton = document.getElementById("downvote");

submitQuestionButton.addEventListener("click", toSubmitQuestion)

function onRefreshPage() {
    var allQuestions = getAllQuestions();

    allQuestions.forEach(function(question) {
        addQuestionInForm(question);
    })
}

onRefreshPage();

function toSubmitQuestion() {
    var question = {
        title: questionTitle.value,
        description: questionDescription.value,
        responses: [],
        upvotes: 0,
        downvotes: 0
    }

    saveQuestion(question);
    addQuestionInForm(question);

}

function saveQuestion(question) {
    var allQuestions = getAllQuestions();

    allQuestions.push(question);

    localStorage.setItem("questions", JSON.stringify(allQuestions));
}

function getAllQuestions() {
    var allQuestions = localStorage.getItem("questions")

    if (allQuestions) {
        allQuestions = JSON.parse(allQuestions)
    } else {
        allQuestions = []
    }
    return allQuestions;
}

function addQuestionInForm(question) {
    var questionContainer = document.createElement("div");
    questionContainer.setAttribute("id", question.title);
    questionContainer.style.background = "teal";
    questionContainer.style.borderRadius = "5px";
    questionContainer.style.color = "white"

    var newQuestionTitle = document.createElement("h2");
    newQuestionTitle.innerHTML = question.title;
    questionContainer.appendChild(newQuestionTitle);

    var newQuestionDescription = document.createElement("h4")
    newQuestionDescription.innerHTML = question.description;
    questionContainer.appendChild(newQuestionDescription);

    var upvotes = document.createElement("h4");
    upvotes.innerHTML = "Upvotes=" + question.upvotes;
    questionContainer.appendChild(upvotes);

    var downvotes = document.createElement("h4");
    downvotes.innerHTML = "Downvotes=" + question.downvotes;
    questionContainer.appendChild(downvotes);

    allQuestionList.appendChild(questionContainer);

    clearQuestionForm();
    questionContainer.addEventListener("click", onQuestionClick(question));

}

function clearQuestionForm() {
    questionTitle.value = "";
    questionDescription.value = "";
}

function onQuestionClick(question) {
    return function() {

        hideDiscussionportal();

        clearQuestionPanel();
        clearResponseContainer();

        showDetails();

        addQuestionToRight(question);

        question.responses.forEach(function(response) {
            addCommentInPanel(response);
        })

        submitCommentButton.onclick = onCommentSubmit(question);
        upvoteButton.onclick = upvoteQuestion(question);
        downvoteButton.onclick = downvoteQuestion(question);
        resolveQuestionButton.onclick = questionCompleted(question);

    }
}

function hideDiscussionportal() {
    createQuestionForm.style.display = "none";
}

function clearQuestionPanel() {
    questionDetailContainer.innerHTML = "";
}

function clearResponseContainer() {
    responseContainer.innerHTML = "";
}


function showDetails() {
    var questionPanelDetails = document.getElementsByClassName("questionPanel")
    for (var i = 0; i < questionPanelDetails.length; i++) {
        questionPanelDetails[i].style.display = "block";
    }
}

function addQuestionToRight(question) {
    var title = document.createElement("h3");
    title.innerHTML = question.title;

    var description = document.createElement("p");
    description.innerHTML = question.description;

    questionDetailContainer.appendChild(title);
    questionDetailContainer.appendChild(description);
}

function onCommentSubmit(question) {
    return function() {
        var response = {
            name: commentatorName.value,
            description: comment.value
        }

        saveComment(question, response);

        addCommentInPanel(response);

        clearCommentPanel();


    }

}

function addCommentInPanel(response) {
    var container = document.createElement("div");

    var userName = document.createElement("h4");
    userName.innerHTML = response.name;

    var userComment = document.createElement("p");
    userComment.innerHTML = response.description;

    container.appendChild(userName);
    container.appendChild(userComment);

    responseContainer.appendChild(container);


}

function clearCommentPanel() {
    commentatorName.value = "";
    comment.value = "";

}

function saveComment(updatedQuestion, response) {
    var allQuestions = getAllQuestions();

    var revisedQuestion = allQuestions.map(function(question) {
        if (updatedQuestion.title === question.title) {
            question.responses.push(response)
        }

        return question;

    })

    localStorage.setItem("questions", JSON.stringify(revisedQuestion))
}



function questionCompleted(question) {
    return function() {
        showDiscussionPanel();
        var questionCont = document.getElementById(question.title);

        questionCont.remove();

        var index = JSON.parse(localStorage.questions);

    }
}

function showDiscussionPanel() {
    createQuestionForm.style.display = "block";
    var questionPanelDetails = document.getElementsByClassName("questionPanel")
    for (var i = 0; i < questionPanelDetails.length; i++) {
        questionPanelDetails[i].style.display = "none";
    }
}

searchQuestion.addEventListener("change", function(event) {
    searchedQuestionResult(event.target.value);
})

function searchedQuestionResult(anyValue) {
    clearAllQuestionList();
    var allQuestions = getAllQuestions();
    if (anyValue) {

        var searchedQuestions = allQuestions.filter(function(question) {
            if (question.title.includes(anyValue)) {
                return true;
            }
        });

        if (searchedQuestions.length) {
            searchedQuestions.forEach(function(question) {
                addQuestionInForm(question);
            })
        } else {
            noMatchFound();
        }
    } else {
        allQuestions.forEach(function(question) {
            addQuestionInForm(question);
        })

    }


}

function clearAllQuestionList() {
    allQuestionList.innerHTML = "";
}

function noMatchFound() {
    var show = document.createElement("h1");
    show.innerHTML = "No Match Found!";

    allQuestionList.appendChild(show);
}

function upvoteQuestion(question) {
    return function() {
        question.upvotes++;
        updateQuestionBox(question);
        updateQuestionUi(question);
    }
}

function downvoteQuestion(question) {
    return function() {
        question.downvotes++;
        updateQuestionBox(question);
        updateQuestionUi(question);
    }
}

function updateQuestionBox(updatedQuestion) {
    var allQuestions = getAllQuestions();

    var revisedQuestion = allQuestions.map(function(question) {
        if (updatedQuestion.title === question.title) {
            return updatedQuestion;
        }

        return question;

    })

    localStorage.setItem("questions", JSON.stringify(revisedQuestion))
}

function updateQuestionUi(question) {
    var questionContainer = document.getElementById(question.title);
    questionContainer.childNodes[2].innerHTML = "Upvotes=" + question.upvotes;
    questionContainer.childNodes[3].innerHTML = "Downvotes=" + question.downvotes;
}