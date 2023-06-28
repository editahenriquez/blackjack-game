/*
  2C = Two of clubs
  2D = Two of Diamonds
  2H = Two of Hearts
  2S = Two of Spades
*/

const myModule = (() => {
    'use strict';

    let deck = [];
    const types = ['C', 'D', 'H', 'S'],
          specials = ['A','J','Q','K'];

    let pointsPlayers = [];

    //HTM References
    const btnDeal = document.querySelector('#btnDeal'),
          btnStand = document.querySelector('#btnStand'),
          btnReset = document.querySelector('#btnReset');

    
    const divCardsPlayers = document.querySelectorAll('.divCards'),
          pointsHTML = document.querySelectorAll('small'),
          score = document.querySelectorAll('.score');

    const createDeack = () => {
        deck = [];
        for (let i = 2; i <=10; i++) {
            for (let tipo of types){
                deck.push(i + tipo)
            }
        }
    
        for (let tipo of types){
            for (let esp of specials){
                deck.push(esp + tipo);
            }
        }
    
        return _.shuffle(deck);
    };

    const resetGame = (numPlayers = 2) => {
        deck = createDeack();
        pointsPlayers= [];

        for (let i = 0; i < numPlayers; i++){
            pointsPlayers.push(0);
        }

        pointsHTML.forEach( elem => elem.innerText = 0);
        divCardsPlayers.forEach( elem => elem.innerText = '');
        score.forEach( elem => elem.innerText = '');

        btnDeal.disabled = false;
        btnStand.disabled = false;
    };

    const dealCard = () => {
        if ( deck.length === 0) {
            throw 'Theres no cards in the deck'
        }

        return deck.pop();
    };

    const valueCard = (card) => {
        const value = card.substring(0, card.length -1)
        return (isNaN(value)) ? (value==='A') ? 11 : 10 : value * 1;
    };

    //The last turn is for the computer
    const amountPoints = (card, turn) => {
        pointsPlayers[turn] = pointsPlayers[turn] + valueCard(card);
        pointsHTML[turn].innerText = pointsPlayers[turn];
        return pointsPlayers[turn];
    };

    const createCard = (card, turn) => {
        const imgCard = document.createElement('img')
        imgCard.src=`assets/cards/${card}.png`
        imgCard.classList.add('card');
        divCardsPlayers[turn].append(imgCard);
    };

    const defineWinner = () => {
        const [pointsMinimun, pointsComputer] = pointsPlayers;

        setTimeout(() => {
            if (pointsComputer === pointsMinimun) {
                score[0].innerText = '  Tie!';
                score[pointsPlayers.length - 1].innerText = '  Tie!';
              } else if (pointsComputer > 21 && pointsMinimun <= 21) {
                score[0].innerText = '  Winner!🥇';
              } else {
                score[pointsPlayers.length - 1].innerText = '  Winner!🥇';
              };
        }, 150);
    };

    const turnComputer = (pointsMinimun) => {
        let pointsComputer = 0;
        do {
            const card = dealCard();
            pointsComputer= amountPoints(card, pointsPlayers.length - 1);
            createCard(card, pointsPlayers.length - 1);
            
        }while( pointsComputer < pointsMinimun && pointsMinimun<= 21);

        defineWinner();
    };

    //Events
    btnDeal.addEventListener('click',()=>{
        const card = dealCard();
        let pointsPlayer= amountPoints(card, 0);

        createCard(card, 0);

        if (pointsPlayer > 21) {
            score[pointsPlayers.length - 1].innerText = '  Winner!🥇';

            btnDeal.disabled = true;
            btnStand.disabled = true;
            turnComputer(pointsPlayer);

        } else if (pointsPlayer === 21) {
            score[0].innerText = '  Winner!🥇';
            btnDeal.disabled = true;
            btnStand.disabled = true;
            turnComputer(pointsPlayer);
        };
    });


    btnStand.addEventListener('click', () => {
        btnDeal.disabled = true;
        btnStand.disabled = true;
        turnComputer(pointsPlayers[0]);
    });

    btnReset.addEventListener('click', () => {
        resetGame();
    });

    return {
        newGame: resetGame
    };
})();