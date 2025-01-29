class QuizGame {
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedOption = null;
        this.isAnswered = false;

        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.categoryGrid = document.querySelector('.desks-grid');
        this.quizSection = document.querySelector('.quiz-section');
        this.questionElement = document.querySelector('.question');
        this.optionsElement = document.querySelector('.options');
        this.feedbackMessage = document.querySelector('.feedback-message');
        this.submitButton = document.querySelector('.submit-btn');
        this.nextButton = document.querySelector('.next-btn');
        this.scoreElement = document.querySelector('.score');
        this.totalElement = document.querySelector('.total');
        this.backButton = document.querySelector('.back-to-categories');
    }

    initializeEventListeners() {
        this.categoryGrid.addEventListener('click', (e) => {
            const desk = e.target.closest('.desk');
            if (desk) {
                this.loadQuestions(desk.dataset.category);
            }
        });

        this.submitButton.addEventListener('click', () => this.checkAnswer());
        this.nextButton.addEventListener('click', () => this.nextQuestion());
        this.backButton.addEventListener('click', () => this.showCategories());
    }

    loadQuestions(category) {
        let filePath = '';
        if (category === '대한민국 음악') {
            filePath = '/quiz-data/korea-music.json';
        } else if (category === '사자성어') {
            filePath = '/quiz-data/korea-word.json';
        } else if (category === '넌센스') {
            filePath = '/quiz-data/korea-nonsense.json';
        } else if (category === '미술') {
            filePath = '/quiz-data/korea-art.json';
        } else if (category === '경제') {
            filePath = '/quiz-data/korea-economy.json';
        } else if (category === '역사') {
            filePath = '/quiz-data/korea-history.json';
        } else if (category === '연예인') {
            filePath = '/quiz-data/korea-celebrity.json';
        } else if (category === '스포츠') {
            filePath = '/quiz-data/korea-sports.json';
        } else if (category === '기본지식') {
            filePath = '/quiz-data/korea-basic.json';
        }

        if (filePath) {
            fetch(filePath)
                .then(response => response.json())
                .then(data => {
                    this.questions = this.shuffleArray(data.questions).slice(0, 10);
                    this.currentQuestion = 0;
                    this.score = 0;
                    this.updateScore();
                    this.showQuizSection();
                    this.displayQuestion();
                })
                .catch(error => console.error('Error loading questions:', error));
        }
    }

    showCategories() {
        this.categoryGrid.style.display = 'grid';
        this.quizSection.classList.remove('active');
        this.backButton.style.display = 'none';
    }

    showQuizSection() {
        this.categoryGrid.style.display = 'none';
        this.quizSection.classList.add('active');
        this.backButton.style.display = 'block';
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestion];
        this.questionElement.textContent = question.question;
        this.optionsElement.innerHTML = '';
        this.feedbackMessage.style.opacity = '0';
        this.isAnswered = false;
        this.selectedOption = null;
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectOption(index));
            this.optionsElement.appendChild(optionElement);
        });

        this.submitButton.style.display = 'block';
        this.nextButton.style.display = 'none';
    }

    selectOption(index) {
        if (this.isAnswered) return;
        
        this.optionsElement.querySelectorAll('.option').forEach(option => {
            option.classList.remove('selected');
        });
        this.optionsElement.children[index].classList.add('selected');
        this.selectedOption = index;
    }

    checkAnswer() {
        if (this.selectedOption === null || this.isAnswered) return;

        this.isAnswered = true;
        const question = this.questions[this.currentQuestion];
        const options = this.optionsElement.children;
        const selectedElement = options[this.selectedOption];

        if (this.selectedOption === question.correct) {
            selectedElement.classList.add('correct');
            this.score++;
            this.showFeedback(true);
        } else {
            selectedElement.classList.add('wrong');
            options[question.correct].classList.add('correct');
            this.showFeedback(false);
        }

        this.updateScore();
        this.submitButton.style.display = 'none';
        this.nextButton.style.display = 'block';
    }

    showFeedback(isCorrect) {
        const messages = isCorrect ? 
            ['대단해요! 👏', '천재시네요! 🎉', '완벽해요! 🌟', '대박! 💫'] :
            ['앗! 멍청이! 😅', '아이고~ 공부 좀 더 하자! 😅', '이런 문제도 못 맞추다니! 😭', '더 노력해보자! 💪'];
                
        this.feedbackMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
        this.feedbackMessage.style.opacity = '1';

        setTimeout(() => {
            this.feedbackMessage.style.opacity = '0';
        }, 2000);
    }

    nextQuestion() {
        if (this.currentQuestion < this.questions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        } else {
            alert(`퀴즈가 끝났습니다!\n최종 점수: ${this.score}/10`);
            this.showCategories();
        }
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        this.totalElement.textContent = "10";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const bgm = new Audio('images/quiz_game_bgm.mp3');
    bgm.loop = true; // 반복 재생 설정

    // 페이지가 로드될 때마다 오디오 재생 시도
    const playBGM = () => {
        bgm.play().catch(error => {
            console.error('배경음악 재생 오류:', error);
        });
    };

    // 사용자의 상호작용이 있을 때 오디오 재생
    document.body.addEventListener('click', playBGM, { once: true });

    new QuizGame();
});