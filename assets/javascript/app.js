/* 

1. The game starts when the player hits the START button.
2. Once the game starts, the clock starts to countdown.
3. The time given is the total time to answer one question.
    3a. Select the correct answer, display message of 'correct', add to correct variable.
    3b. Select the wrong answer, display message of 'incorrect', give right answer, add to incorrect variable.
    3c. If time expires, display message of 'times up', give right answer, add to unanswered variable.
    3d. OPTIONAL: Add gif if time permits.
4. The player can only guess one answer per question.
5. Add setTimeout after displaying any of the correct, incorrect, unanswered message.
6. After getting through all questions, display scoreboard with stats.
7. Add a 'start over' button to allow game to start over without reload.

*/

$(document).ready(function () {

    // Set up variables
    var currentQuestion;
    var correctAnswer;
    var incorrectAnswer;
    var unanswered;
    var seconds;
    var time;
    var answered;
    var userSelect;

    var messages = {
        correct: "You got it!",
        incorrect: "You're so wrong.",
        endTime: "You're out of time.",
        finished: "Let's see how you did."
    }

    // Questions array
    var quizQuestions = [{
        question: "Who lived in the pit for awhile?",
        answerList: ["Ann Perkins", "Andy Dwyer", "Leslie Knope", "Ron Swanson"],
        validAnswer: 1
    }, {
        question: "Who is the deputy Parks Director of Pawnee?",
        answerList: ["Ron Swanson", "Tom Haverford", "Leslie Knope", "Ann Perkins"],
        validAnswer: 2
    }, {
        question: "What clothing rental company did Tom start?",
        answerList: ["Rent-A-Swag", "Rent, Rent", "Rent Yourself", "Rent-R-Us"],
        validAnswer: 0
    }, {
        question: "What is the town's beloved mini horse named?",
        answerList: ["Li'l Jemaine", "Li'l Sebastian", "Li'l Bill", "Li'l Bianca"],
        validAnswer: 1
    }, {
        question: "What is Jerry's real name?",
        answerList: ["Terry", "Barry", "Garry", "Larry"],
        validAnswer: 2
    }, {
        question: "Who shoots Ron in the head on the hunting trip?",
        answerList: ["Leslie Knope", "Andy Dwyer", "Tom Haverford", "Ann Perkins"],
        validAnswer: 2
    }, {
        question: "Who is Tom's best friend?",
        answerList: ["Ron Swanson", "Ben Wyatt", "Chris Traeger", "Jean-Ralphio"],
        validAnswer: 3
    }, {
        question: "What board game does Benn Wyatt create?",
        answerList: ["Clue", "The Cones of Dunshire", "Monopoly", "The Iron Throne"],
        validAnswer: 1
    }, {
        question: "Leslie Knope brings back what to save the Parks Dept?",
        answerList: ["Spring Festival", "Icicle Festival", "Festival", "Harvest Festival"],
        validAnswer: 3
    }, {
        question: "What is the name of the town's candy company?",
        answerList: ["Candiopolis", "Sweetums", "Sugarcoat", "Choco-yum"],
        validAnswer: 1
    },];

    // Only thing I could do in order to hide my "start over" button on launch/reload.
    $("#startOverBtn").hide();

    // Start button on click function
    $("#startBtn").on("click", function () {
        $(this).hide();
        newGame();
    });

    // Start over button on click function
    $("#startOverBtn").on("click", function () {
        $(this).hide();
        newGame();
    });

    // New game function (resets game)
    function newGame() {
        $("#finalMessage").empty();
        $("#correctAnswers").empty();
        $("#incorrectAnswers").empty();
        $("#unanswered").empty();

        currentQuestion = 0;
        correctAnswer = 0;
        incorrectAnswer = 0;
        unanswered = 0;

        newQuestion();
    }

    // Gets a new question and answers
    function newQuestion() {
        $("#message").empty();
        $("#correctedAnswer").empty();
        $("#gif").empty();
        answered = true;

        $("#currentQuestion").html("Question #" + (currentQuestion + 1) + "/" + quizQuestions.length);
        $(".question").html("<h2>" + quizQuestions[currentQuestion].question + "</h2>");

        // NOTE: Had to research part of this code. Got stuck here for awhile.
        for (var i = 0; i < 4; i++) {
            var choices = $("<div>");
            choices.text(quizQuestions[currentQuestion].answerList[i]);
            choices.attr({ "data-index": i });
            choices.addClass("thisChoice");
            $(".answerList").append(choices);
        }

        countDown();

        // NOTE: Had to research part of this code. Got stuck here for awhile.
        $(".thisChoice").on("click", function () {
            userSelect = $(this).data("index");
            clearInterval(time);
            answerPage();
        });
    }

    // Timer count down for each question (10 seconds)
    function countDown() {
        seconds = 10;
        $("#timeLeft").html("<h3>Time Remaining: " + seconds + "</h3>");
        answered = true;

        time = setInterval(showCountDown, 1000);
    }

    function showCountDown() {
        seconds--;
        $("#timeLeft").html("<h3>Time Remaining: " + seconds + "</h3>");

        if (seconds < 1) {
            clearInterval(time);
            answered = false;
            answerPage();
        }
    }

    // Answer page. Displays if you got it right or wrong and displays the right answer if wrong.
    function answerPage() {
        $("#currentQuestion").empty();
        $(".thisChoice").empty();
        $(".question").empty();

        var rightAnswerText = quizQuestions[currentQuestion].answerList[quizQuestions[currentQuestion].validAnswer];
        var rightAnswerIndex = quizQuestions[currentQuestion].validAnswer;

        // giphy api begin ---------------------------
        // NOTE: Used "https://www.youtube.com/watch?v=fEYx8dQr_cQ" for help with this section. Still not 100% sure what all this code does...
        // Also struggled here for awhile.
        var giphyURL = "http://api.giphy.com/v1/gifs/search?q=parks+and+rec+" + [rightAnswerText] + "&limit=1&rating=g&api_key=dc6zaTOxFJmzC"
        $.ajax({
            url: giphyURL, 
            method: "GET"
        }).done(function (giphy) {
            var currentGif = giphy.data;
            $.each(currentGif, function (index, value) {
                var embedGif = value.images.original.url;
                newGif = $("<img>");
                newGif.attr("src", embedGif);
                newGif.addClass("gifImg");
                $("#gif").html(newGif);
            });
        });
        // giphy api end -----------------------------

        // This code checks to see if questions is right, wrong, or unanswered.
        if ((userSelect == rightAnswerIndex) && (answered == true)) {
            correctAnswer++;
            $("#message").html(messages.correct);
        } else if ((userSelect != rightAnswerIndex) && (answered == true)) {
            incorrectAnswer++;
            $("#message").html(messages.incorrect);
            $("#correctedAnswer").html("The right answer was: " + rightAnswerText);
        } else {
            unanswered++;
            $("#message").html(messages.endTime);
            $("#correctedAnswer").html("The right answer was: " + rightAnswerText);
            answered = true;
        }

        if (currentQuestion == (quizQuestions.length - 1)) {
            setTimeout(scoreboard, 4000);
        } else {
            currentQuestion++;
            setTimeout(newQuestion, 4000);
        }
    }

    // Scoreboard function. Displays stats at the end of the game plus a Start Over button.
    function scoreboard() {
        $("#timeLeft").empty();
        $("#message").empty();
        $("#correctedAnswer").empty();
        $("#gif").empty();

        $("#finalMessage").html(messages.finished);
        $("#correctAnswers").html("Correct Answers: " + correctAnswer);
        $("#incorrectAnswers").html("Incorrect Answers: " + incorrectAnswer);
        $("#unanswered").html("Unanswered: " + unanswered);
        $("#startOverBtn").show();
    }
});