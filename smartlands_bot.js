const TeleBot = require('telebot');
var express = require('express');
var bodyParser = require('body-parser');
var StellarSdk = require('stellar-sdk');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var db = require('./db');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


//DATA VARIABLES

var lastMessage;
var quizCounter = 1;
var quizSuccess = 0;
var userAddress, userID, userMemo, userAmount;
const groupName='@smartlandstest';
var sourceSecretKey = 'SBCBI67SSXNG4ELHTGBZYLWQP2CGWMHISEO2BHABNPZZGDMMVANCZVVA';
var faqAnswers = [
    `<b>FAQ Qustion 1:</b> 

❇️ I want the output of this string '012' but I don't want to use subString or something similar to it because I need to use the original string for appending more characters '45'. <b>With substring it will output 01245 but what I need is 01212345.</b>`,
    `<b>FAQ Qustion 2:</b> 

❇️ I want the output of this string '012' but I don't want to use subString or something similar to it because I need to use the original string for appending more characters '45'. <b>With substring it will output 01245 but what I need is 01212345.</b>`,
    `<b>FAQ Qustion 3:</b> 

❇️ I want the output of this string '012' but I don't want to use subString or something similar to it because I need to use the original string for appending more characters '45'. <b>With substring it will output 01245 but what I need is 01212345.</b>`,
    `<b>FAQ Qustion 4:</b> 

❇️ I want the output of this string '012' but I don't want to use subString or something similar to it because I need to use the original string for appending more characters '45'. <b>With substring it will output 01245 but what I need is 01212345.</b>`,
    `<b>FAQ Qustion 5:</b> 

❇️ I want the output of this string '012' but I don't want to use subString or something similar to it because I need to use the original string for appending more characters '45'. <b>With substring it will output 01245 but what I need is 01212345.</b>`,
    `<b>FAQ Qustion 6:</b> 

❇️ I want the output of this string '012' but I don't want to use subString or something similar to it because I need to use the original string for appending more characters '45'. <b>With substring it will output 01245 but what I need is 01212345.</b>`,
    `<b>FAQ Qustion 7:</b> 

❇️ I want the output of this string '012' but I don't want to use subString or something similar to it because I need to use the original string for appending more characters '45'. <b>With substring it will output 01245 but what I need is 01212345.</b>`,
    `<b>FAQ Qustion 8:</b> 

❇️ I want the output of this string '012' but I don't want to use subString or something similar to it because I need to use the original string for appending more characters '45'. <b>With substring it will output 01245 but what I need is 01212345.</b>`
];

//BOT TOKEN
const bot = new TeleBot({
    token: '1761400690:AAFt-mNo_5GU8f5pKKlFR8fYyFS6avCKVhw',
    allowedUpdates: [],
    pluginFolder: '../plugins/',
    pluginConfig: {}
})

//BOT START
bot.on(['/start', '/hello'], (msg) => {

    bot.getChatMember(groupName, msg.from.id).then(function(data) {
   
        if (data.status == 'member' || data.status == 'creator' || data.status == 'admin') {

            console.log(data.status);


            db.collection('telegram').findOne({
                id: msg.from.id
            }, function(err, doc) {
                if (err) {
                    console.log(err);
                }
                if (doc) {

                    console.log(doc);

                    if (doc.leader_bonus == undefined) {
                        doc.leader_bonus == ''
                    }

                    return bot.sendMessage(msg.from.id, `You have <b> ${ doc.welcome_bonus } welcome SLT</b>, <b>${ doc.invitations_bonus } invitation SLT </b>.
<b>${ parseFloat(( doc.welcome_bonus + doc.invitations_bonus ).toFixed(4)) } SLT ☘️ in total.</b> Good luck, ${ msg.from.first_name }!`, {
                        asReply: true,
                        parseMode: 'HTML'
                    });

                } else {
                    console.log('netu v baze');

                    if (msg.from.username == undefined) {
                        msg.from.username == ''
                    }
                    if (msg.from.first_name == undefined) {
                        msg.from.first_name == ''
                    }
                    if (msg.from.last_name == undefined) {
                        msg.from.last_name == ''
                    }

                    db.collection('telegram').insert({
                            id: msg.from.id,
                            first_name: msg.from.first_name,
                            last_name: msg.from.last_name,
                            username: msg.from.username,
                            welcome_bonus: 1,
                            invited_users: [0],
                            invitations_count: 0,
                            invitations_bonus: 0,
                            quiz_bonus: 0,
                            leader_bonus: 0,
                            total_balance: 1,
                            stellar_adress: '',
                            ether_adress: '',
                            quizpass: 0,
                            deleted: 0
                        },
                        function(err, result) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    console.log('dobavili');
                }
            });

        } else {

            return bot.sendMessage(msg.from.id, `Please first join the Smartlands Community @smartlandstest`, {
                asReply: true,
                parseMode: 'HTML'
            });

        }

    }).catch(function(err) {
        let replyMarkup = bot.keyboard([
            [bot.button('/start1', 'Start')]

        ], {
            resize: true
        });
        return bot.sendMessage(msg.from.id, `Please first join the Smartlands Community @smartlandstest`, {
            asReply: true,
            parseMode: 'HTML'
        });

    });


    let replyMarkup = bot.keyboard([
        [bot.button('📚  Learn'), bot.button('☘️  SLT'), bot.button('🚀  Withdraw')],
        [bot.button('💬  FAQ'), bot.button('📖  Conditions')]
    ], {
        resize: true
    });

    return bot.sendMessage(msg.from.id, `Hello, ${ msg.from.first_name }! Welcome to Smartlands Bot ☘️. Leanr and Earn. Invite more friends - get more <b>SLT</b>`, {
        replyMarkup,
        parseMode: 'HTML'
    });
});


var showVideo = function(msgid, videoNumber) {




    if (videoNumber == 1) {

        let replyMarkup1 = bot.inlineKeyboard([
            [
                bot.inlineButton('▶️  Watch next lesson', {
                    callback: 'video2'
                }),
            ]
        ], {
            resize: true
        });




        var video = 'http://yt.checker.in/utubebot/Smartlands_Fundraising_Plugin_Demo_Guideline.136.mp4'
        return bot.sendVideo(msgid, video, {
            parseMode: 'HTML',
            caption: `
<b>Lesson 1/3. Smartlands ☘️ Learn</b> 
Learnabout Smartlands <b>TEXT DESCRIPTION</b> 
`,
            replyMarkup: replyMarkup1
        });
    } else if (videoNumber == 2) {
        let replyMarkup2 = bot.inlineKeyboard([
            [
                bot.inlineButton('▶️  Watch next lesson', {
                    callback: 'video3'
                }),
            ]
        ], {
            resize: true
        });

        var video = 'http://yt.checker.in/utubebot/Investing_in_Fractional_Ownership_on_Smartlands_Explain.137.mp4'
        return bot.sendVideo(msgid, video, {
            parseMode: 'HTML',
            caption: `
<b>Lesson 2/3. Smartlands ☘️ Learn</b> 
Learnabout Smartlands <b>TEXT DESCRIPTION</b> 
`,
            replyMarkup: replyMarkup2
        });
    } else if (videoNumber == 3) {
        let replyMarkup3 = bot.inlineKeyboard([
            [
                bot.inlineButton('▶️ Watch next lesson', {
                    callback: 'video1'
                }),
            ]
        ], {
            resize: true
        });


        var video = 'http://yt.checker.in/utubebot/Smartlands_Platform_Users_Talk_About_Their_Experience.134.mp4'
        return bot.sendVideo(msgid, video, {
            parseMode: 'HTML',
            caption: `
<b>Lesson 3/3. Smartlands ☘️ Learn</b> 
Learnabout Smartlands <b>TEXT DESCRIPTION</b> 
`,
            replyMarkup: replyMarkup3
        });
    }
}

var nextQuestion = function(msgid) {

    db.collection('telegram').findOne({
        id: msgid
    }, function(err, doc) {
        if (err) {
            console.log(err);
        }
        if (doc.quizpass != 1) {


            if (quizCounter == 1) {

                let replyMarkup = bot.inlineKeyboard([
                    [
                        bot.inlineButton('1 000 000 SLT', {
                            callback: 'wrong 1 000 000 SLT'
                        }),
                        bot.inlineButton('8 000 000 SLT', {
                            callback: 'right 8 000 000 SLT'
                        }),
                        bot.inlineButton('21 000 000 SLT', {
                            callback: 'wrong 21 000 000 SLT'
                        })
                    ]
                ], {
                    resize: true
                });

                return bot.sendPhoto(msgid, photo = 'https://ibb.co/H2RbvPx', {
                    caption: `Question ${quizCounter}/10: <b>What is SLT circulating supply?</b>`,
                    parseMode: 'HTML',
                    replyMarkup
                });

            } else if (quizCounter == 2) {
                let replyMarkup = bot.inlineKeyboard([
                    [
                        bot.inlineButton('11 000 000 SLT', {
                            callback: 'wrong 1 000 000 SLT'
                        }),
                        bot.inlineButton('8 000 000 SLT', {
                            callback: 'right 8 000 000 SLT'
                        }),
                        bot.inlineButton('31 000 000 SLT', {
                            callback: 'wrong 21 000 000 SLT'
                        })
                    ]
                ], {
                    resize: true
                });

                return bot.sendPhoto(msgid, photo = 'https://ibb.co/C6DTLDR', {
                    caption: `Question ${quizCounter}/10: <b>What is SLT circulating supply?</b>`,
                    parseMode: 'HTML',
                    replyMarkup
                });
            } else if (quizCounter == 3) {
                let replyMarkup = bot.inlineKeyboard([
                    [
                        bot.inlineButton('11 000 000 SLT', {
                            callback: 'wrong 1 000 000 SLT'
                        }),
                        bot.inlineButton('8 000 000 SLT', {
                            callback: 'right 8 000 000 SLT'
                        }),
                        bot.inlineButton('31 000 000 SLT', {
                            callback: 'wrong 21 000 000 SLT'
                        })
                    ]
                ], {
                    resize: true
                });

                return bot.sendPhoto(msgid, photo = 'https://ibb.co/2jgtW68', {
                    caption: `Question ${quizCounter}/10: <b>What is SLT circulating supply?</b>`,
                    parseMode: 'HTML',
                    replyMarkup
                });
            } else if (quizCounter == 4) {
                let replyMarkup = bot.inlineKeyboard([
                    [
                        bot.inlineButton('11 000 000 SLT', {
                            callback: 'wrong 1 000 000 SLT'
                        }),
                        bot.inlineButton('8 000 000 SLT', {
                            callback: 'right 8 000 000 SLT'
                        }),
                        bot.inlineButton('31 000 000 SLT', {
                            callback: 'wrong 21 000 000 SLT'
                        })
                    ]
                ], {
                    resize: true
                });

                return bot.sendPhoto(msgid, photo = 'https://ibb.co/ydD4rpP', {
                    caption: `Question ${quizCounter}/10: <b>What is SLT circulating supply?</b>`,
                    parseMode: 'HTML',
                    replyMarkup
                });
            } else if (quizCounter == 5) {
                let replyMarkup = bot.inlineKeyboard([
                    [
                        bot.inlineButton('11 000 000 SLT', {
                            callback: 'wrong 1 000 000 SLT'
                        }),
                        bot.inlineButton('8 000 000 SLT', {
                            callback: 'right 8 000 000 SLT'
                        }),
                        bot.inlineButton('31 000 000 SLT', {
                            callback: 'wrong 21 000 000 SLT'
                        })
                    ]
                ], {
                    resize: true
                });

                return bot.sendPhoto(msgid, photo = 'https://ibb.co/c8g7hkk', {
                    caption: `Question ${quizCounter}/10: <b>What is SLT circulating supply?</b>`,
                    parseMode: 'HTML',
                    replyMarkup
                });
            } else if (quizCounter == 6) {
                let replyMarkup = bot.inlineKeyboard([
                    [
                        bot.inlineButton('11 000 000 SLT', {
                            callback: 'wrong 1 000 000 SLT'
                        }),
                        bot.inlineButton('8 000 000 SLT', {
                            callback: 'right 8 000 000 SLT'
                        }),
                        bot.inlineButton('31 000 000 SLT', {
                            callback: 'wrong 21 000 000 SLT'
                        })
                    ]
                ], {
                    resize: true
                });

                return bot.sendPhoto(msgid, photo = 'https://ibb.co/HTLKLry', {
                    caption: `Question ${quizCounter}/10: <b>What is SLT circulating supply?</b>`,
                    parseMode: 'HTML',
                    replyMarkup
                });
            } else if (quizCounter == 7) {
                let replyMarkup = bot.inlineKeyboard([
                    [
                        bot.inlineButton('11 000 000 SLT', {
                            callback: 'wrong 1 000 000 SLT'
                        }),
                        bot.inlineButton('8 000 000 SLT', {
                            callback: 'right 8 000 000 SLT'
                        }),
                        bot.inlineButton('31 000 000 SLT', {
                            callback: 'wrong 21 000 000 SLT'
                        })
                    ]
                ], {
                    resize: true
                });

                return bot.sendPhoto(msgid, photo = 'https://ibb.co/q5D1Yvh', {
                    caption: `Question ${quizCounter}/10: <b>What is SLT circulating supply?</b>`,
                    parseMode: 'HTML',
                    replyMarkup
                });
            } else if (quizCounter == 8) {
                let replyMarkup = bot.inlineKeyboard([
                    [
                        bot.inlineButton('11 000 000 SLT', {
                            callback: 'wrong 1 000 000 SLT'
                        }),
                        bot.inlineButton('8 000 000 SLT', {
                            callback: 'right 8 000 000 SLT'
                        }),
                        bot.inlineButton('31 000 000 SLT', {
                            callback: 'wrong 21 000 000 SLT'
                        })
                    ]
                ], {
                    resize: true
                });

                return bot.sendPhoto(msgid, photo = 'https://ibb.co/4g1Y44J', {
                    caption: `Question ${quizCounter}/10: <b>What is SLT circulating supply?</b>`,
                    parseMode: 'HTML',
                    replyMarkup
                });
            } else if (quizCounter == 9) {
                let replyMarkup = bot.inlineKeyboard([
                    [
                        bot.inlineButton('11 000 000 SLT', {
                            callback: 'wrong 1 000 000 SLT'
                        }),
                        bot.inlineButton('8 000 000 SLT', {
                            callback: 'right 8 000 000 SLT'
                        }),
                        bot.inlineButton('31 000 000 SLT', {
                            callback: 'wrong 21 000 000 SLT'
                        }),
                        bot.inlineButton('31 000 000 SLT', {
                            callback: 'wrong 21 000 000 SLT'
                        })
                    ]
                ], {
                    resize: true
                });

                return bot.sendPhoto(msgid, photo = 'https://ibb.co/dc9jPR7', {
                    caption: `Question ${quizCounter}/10: <b>What is SLT circulating supply?</b>`,
                    parseMode: 'HTML',
                    replyMarkup
                });
            } else if (quizCounter == 10) {
                let replyMarkup = bot.inlineKeyboard([
                    [
                        bot.inlineButton('11 000 000 SLT', {
                            callback: 'wrong 1 000 000 SLT'
                        }),
                        bot.inlineButton('8 000 000 SLT', {
                            callback: 'right 8 000 000 SLT'
                        }),
                        bot.inlineButton('31 000 000 SLT', {
                            callback: 'wrong 21 000 000 SLT'
                        })
                    ]
                ], {
                    resize: true
                });

                return bot.sendPhoto(msgid, photo = 'https://ibb.co/k4vrDwg', {
                    caption: `Question ${quizCounter}/10: <b>What is SLT circulating supply?</b>`,
                    parseMode: 'HTML',
                    replyMarkup
                });
            }

        } else {

            let replyMarkup = bot.keyboard([
                [bot.button('📚  Learn'), bot.button('☘️  SLT'), bot.button('🚀  Withdraw')],
                [bot.button('💬  FAQ'), bot.button('📖  Conditions')]
            ], {
                resize: true
            });

            return bot.sendPhoto(msgid, photo = 'https://ibb.co/Z8PTk2m', {
                caption: `<b>Congratulations, ${ doc.first_name }!</b> 
You have already passed the Smartlands quiz!`,
                parseMode: 'HTML',
                replyMarkup
            });


        }
    });
}

var finishQuiz = function(msgid) {
    console.log('FINISH QUIZ ', quizCounter);


    db.collection('telegram').findOne({
        id: msgid
    }, function(err, doc) {
        if (err) {
            console.log(err);
        }
        if (doc) {



            var quiz_bon = parseFloat((quizSuccess * 0.1).toFixed(4));
            db.collection('telegram').updateOne({
                id: msgid,
            }, {
                $set: {
                    total_balance: parseFloat((doc.welcome_bonus + quiz_bon).toFixed(4)),
                    quiz_bonus: quiz_bon,
                    quizpass: 1
                }
            });
            let replyMarkup = bot.keyboard([
                [bot.button('📚  Learn'), bot.button('☘️  SLT'), bot.button('🚀  Withdraw')],
                [bot.button('💬  FAQ'), bot.button('📖  Conditions')]
            ], {
                resize: true
            });

            return bot.sendMessage(msgid, `Congratulations! You have passed quiz with a <b>${quizSuccess} from 10</b> rate and get <b>${parseFloat((quizSuccess*0.1).toFixed(4))} SLT</b> 🍀`, {
                replyMarkup,
                parseMode: 'HTML'
            });

            quizCounter = 1;
            quizSuccess = 0;

        }
    });

}




bot.on('callbackQuery', (msg) => {
    var faqTest = msg.data.substring(0, 3);
    if (faqTest == 'faq') {
        var answerText = faqAnswers[msg.data.slice(3) - 1];
        return bot.sendMessage(msg.from.id, answerText, {
            parseMode: 'HTML'
        });
    } else {

        var chatId = msg.from.id;
        var messageId = msg.message.message_id;

        if (msg.data.substring(0, 5) == 'right') {
            bot.editMessageCaption({
                chatId,
                messageId
            }, (`Question ${quizCounter}/10:` + `
<b>${ msg.data.slice(5) }</b> was the right answer 👍`), {
                parseMode: 'HTML'
            });
            quizSuccess = quizSuccess + 1;

            quizCounter = quizCounter + 1;
            if (quizCounter < 11) {
                nextQuestion(msg.from.id);
            } else {
                finishQuiz(msg.from.id)

            }

        } else if (msg.data.substring(0, 5) == 'wrong') {
            bot.editMessageCaption({
                chatId,
                messageId
            }, (`Question ${quizCounter}/10:` + `
<b>${ msg.data.slice(5) }</b> was the wrong answer 👎`), {
                parseMode: 'HTML'
            });

            quizCounter = quizCounter + 1;
            if (quizCounter < 11) {
                nextQuestion(msg.from.id);
            } else {
                finishQuiz(msg.from.id)

            }
        } else if (msg.data.substring(0, 5) == 'video') {
            showVideo(chatId, msg.data.slice(5));
        } else if (msg.data.substring(0, 5) == 'cance') {

            db.collection('telegram').findOne({
                id: msg.from.id
            }, function(err, doc) {
                if (err) {
                    console.log(err);
                }
                if (doc) {



                    db.collection('telegram').updateOne({
                            id: doc.id
                        }, {
                            $set: {
                                deleted: 3
                            }
                        },
                        function(err, result) {
                            if (err) {
                                console.log(err);
                            }

                            let replyMarkup = bot.keyboard([
                                [bot.button('❌  Cancel Withdraw')]
                            ], {
                                resize: true
                            });
                            return bot.sendMessage(msg.from.id, `<b>Input your Stellar Testnet Address ID</b> 
to which you want to send SLT:
<b>${parseFloat(( doc.total_balance ).toFixed(4)) } SLT</b> ☘️ available to Withdraw`, {
                                replyMarkup,
                                parseMode: 'HTML'
                            });

                        });



                }
            });

        }
    }
});

var sendSLT = function(receiverPublicKey, id, amountSLT, userMemo, userName) {
    if (userMemo == '') {
        userMemo = 'Smartlands Bot Reward ☘️'
    }

       
        var sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey);
        var sourcePublicKey = sourceKeypair.publicKey();
        StellarSdk.Network.useTestNetwork();
        var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
        var ass = new StellarSdk.Asset("SLT", "GBOHLO3Y2ITB2G7BMUFL6VHFULRI2KOKYGQ2SNRBVSJ5ALFA2KDV6EVW");
        console.log("ASSET:", ass);
        console.log("DESTINATION:", receiverPublicKey);
        server.loadAccount(sourcePublicKey)
            .then(function(account) {
                var transaction = new StellarSdk.TransactionBuilder(account)
                    .addOperation(StellarSdk.Operation.payment({
                        destination: receiverPublicKey,
                        asset: ass,
                        amount: (parseFloat(amountSLT)).toString(),
                    }))
                    .addMemo(StellarSdk.Memo.text(userMemo))
                    .build();
                transaction.sign(sourceKeypair);
                console.log(transaction.toEnvelope().toXDR('base64'));

                let replyMarkup = bot.keyboard([
                    [bot.button('📚  Learn'), bot.button('☘️  SLT'), bot.button('🚀  Withdraw')],
                    [bot.button('💬  FAQ'), bot.button('📖  Conditions')]
                ], {
                    resize: true
                });


                bot.sendMessage(id, `<b>Sending your ${amountSLT.toString()} SLT ☘️ >> 🚀 to:</b>${receiverPublicKey}`, {
                    parseMode: 'HTML',
                    replyMarkup
                });

                server.submitTransaction(transaction)
                    .then(function(transactionResult) {
                        db.collection('telegram').updateOne({
                                id: id
                            }, {
                                $set: {
                                    invitations_count: 0,
                                    invitations_bonus: 0,
                                    welcome_bonus: 0,
                                    quiz_bonus: 0,
                                    total_balance: 0,
                                    invited_users: [],
                                    stellar_adress: receiverPublicKey,
                                    leader_bonus: 0,
                                    deleted: 0
                                }
                            },
                            function(err, result) {
                                if (err) {} else {
                                    console.log(result);

                                }
                            });
                        let replyMarkup = bot.keyboard([
                            [bot.button('📚  Learn'), bot.button('☘️  SLT'), bot.button('🚀  Withdraw')],
                            [bot.button('💬  FAQ'), bot.button('📖  Conditions')]
                        ], {
                            resize: true
                        });


                        bot.sendMessage(id, `<b>All your ${amountSLT.toString()} SLT ☘️ was successfully withdrawn!</b> 

View the transaction at: <a href="${transactionResult._links.transaction.href}">${transactionResult._links.transaction.href}</a>`, {
                            replyMarkup,
                            parseMode: 'HTML'
                        });

                        bot.sendMessage(groupName, `<b>${amountSLT.toString()} SLT ☘️</b> was successfully withdrawn by <b>@${userName}!</b>`, {

                            parseMode: 'HTML'
                        });


                        console.log('\nSuccess! View transaction at: ');
                        console.log(transactionResult._links.transaction.href);

                    })
                    .catch(function(err) {
                        console.log('An error has occured:');
                        console.log(err);
                    });
            })
            .catch(function(e) {
                console.error(e);
            });


    
}
bot.on('text', (msg, props) => {
    console.log('chat');
    console.log('msg.chat.username:', msg.chat.username);
    console.log('chat: ', msg.chat.username, msg.text, props);
    if (msg.text == 'Start') {
        return bot.event('/start', msg, props);
    } else if (msg.text == '☘️  SLT') {
        bot.getChatMember(groupName, msg.from.id).then(function(data) {
            console.log(data);
            if (data.status == 'member' || data.status == 'creator' || data.status == 'administrator') {
                db.collection('telegram').findOne({
                    id: msg.from.id
                }, function(err, doc) {
                    if (err) {
                        console.log(err);
                    }
                    if (doc) {
                        console.log(doc.leader_bonus);
                        if (doc.leader_bonus == undefined || doc.invitations_count == 0) {
                            console.log(msg.chat.id);
                            return bot.sendMessage(msg.from.id, `💰  <b>Your Smartlands Bot Balance</b>:
—
Welcome bonus:  <b>${parseFloat(( doc.welcome_bonus ).toFixed(4)) } SLT</b>
Quiz reward:  <b>${parseFloat(( doc.quiz_bonus ).toFixed(4)) } SLT</b>
Invitations earn:  <b>${parseFloat(( doc.invitations_bonus ).toFixed(4)) } SLT</b>
————————
Total balance:  <b>${parseFloat(( doc.total_balance ).toFixed(4)) } SLT</b> ☘️
 
Good luck, ${ doc.first_name }!`, {
                                asReply: true,
                                parseMode: 'HTML'
                            });
                        } else if (doc.quizpass != 1) {
                            return bot.sendMessage(msg.from.id, `💰  <b>Your Smartlands Bot Balance</b>:
 —
Welcome bonus:  <b>${parseFloat(( doc.welcome_bonus ).toFixed(4)) } SLT</b>
Quiz reward:  <b>0 SLT</b>
Invitations earn:  <b>${parseFloat(( doc.invitations_bonus ).toFixed(4)) } SLT</b>
————————
Total balance:  <b>${parseFloat(( doc.welcome_bonus + doc.invitations_bonus ).toFixed(4)) } SLT</b> ☘️

Good luck, ${ doc.first_name }!`, {
                                asReply: true,
                                parseMode: 'HTML'
                            });

                        } else {


                            return bot.sendMessage(msg.from.id, `💰  <b>Your Smartlands Bot Balance</b>:
 —
Welcome bonus: <b>${parseFloat(( doc.welcome_bonus ).toFixed(4)) } SLT</b>
Quiz reward: <b>${parseFloat(( doc.quiz_bonus ).toFixed(4)) } SLT</b>
Invitations earn: <b>${parseFloat(( doc.invitations_bonus ).toFixed(4)) } SLT</b>
————————
Total balance: <b>${parseFloat(( doc.total_balance ).toFixed(4)) } SLT</b> ☘️

Good luck, ${ doc.first_name }!`, {
                                asReply: true,
                                parseMode: 'HTML'
                            });
                        }

                    }
                });

            } else {

                return bot.sendMessage(msg.from.id, `⚠️ You are not yet a member of the Smartlands group. 
Please,  <b>first join Smartlands Community:</b> @smartlandstest`, {
                    asReply: true,
                    parseMode: 'HTML'
                });

            }

        });

    } else if (msg.text == '💬  FAQ') {


        bot.getChatMember(groupName, msg.from.id).then(function(data) {

            console.log(data);
            if (data.status == 'member' || data.status == 'creator' || data.status == 'administrator') {

                bot.sendMessage(msg.from.id, `Your FAQ page isn’t just there to address common questions about your business. That’s only part of it. 

There is a questions list about SLT:`, {
                    asReply: true,
                    parseMode: 'HTML'
                });


                let replyMarkup = bot.inlineKeyboard([
                    [bot.inlineButton('How can I buy SLT?', {
                        callback: 'faq1'
                    })],
                    [bot.inlineButton('How to store SLT?', {
                        callback: 'faq2'
                    })],
                    [bot.inlineButton('How can I track the price?', {
                        callback: 'faq3'
                    })],
                    [bot.inlineButton('What does SLT staking imply?', {
                        callback: 'faq4'
                    })],
                    [bot.inlineButton('How can I stake my SLT?', {
                        callback: 'faq5'
                    })],
                    [bot.inlineButton('Is it possible to recover SLT?', {
                        callback: 'faq6'
                    })],
                    [bot.inlineButton('Who can invest on the Smartlands?', {
                        callback: 'faq7'
                    })]

                ], {
                    resize: true
                });

                return bot.sendPhoto(msg.from.id, photo = 'https://ibb.co/pn1tmcr', {
                    caption: `💬  FAQ page isn’t just there to address common questions about your business. That’s only part of it. 

<b>There is a questions list about SLT:</b>`,
                    parseMode: 'HTML',
                    replyMarkup
                });

            } else {
                return bot.sendMessage(msg.from.id, `⚠️ You are not yet a member of the Smartlands group. 
Please,  <b>first join Smartlands Community:</b> @smartlandstest`, {
                    asReply: true,
                    parseMode: 'HTML'
                });
            }



        })
    } else if (msg.text == '🚀  Withdraw') {


        db.collection('telegram').findOne({
            id: msg.from.id
        }, function(err, doc) {
            if (err) {
                console.log(err);
            }
            if (doc) {

                if (doc.quizpass == 1) {

                    db.collection('telegram').updateOne({
                            id: doc.id
                        }, {
                            $set: {
                                deleted: 3
                            }
                        },
                        function(err, result) {
                            if (err) {
                                console.log(err);
                            }

                            let replyMarkup = bot.keyboard([
                                [bot.button('❌  Cancel Withdraw')]
                            ], {
                                resize: true
                            });
                            return bot.sendMessage(msg.from.id, `<b>Input your Stellar Testnet Address ID</b> 
to which you want to send SLT:
<b>${parseFloat(( doc.total_balance ).toFixed(4)) } SLT</b> ☘️ available to Withdraw`, {
                                replyMarkup,
                                parseMode: 'HTML'
                            });

                        });

                } else {
                    return bot.sendMessage(msg.from.id, `🔅  <b>Please pass the QUIZ before Withdraw</b>`, {
                        parseMode: 'HTML'
                    });

                }

            }
        });




    } else if (msg.text == '📖  Conditions') {
        bot.sendPhoto(msg.from.id, photo = 'https://ibb.co/wh0n43C', {
                caption: `<b>🔖 Smartlands Bot Conditions:</b>
`,
                asReply: true,
                parseMode: 'HTML'
            })
            .then(function() {
                bot.sendMessage(msg.from.id, `<b>1. Bounty:</b> 
<b>1.1.</b>  Each @smartlandstest group member receives <b>1 SLT-token</b> as Welcome Bonus. 
<b>1.2.</b>  Smartlands group member who invites friends receives <b> 0.1 SLT</b> for each friend’s invitation.
<b>1.3.</b>  At the beginning of each month before Smartlands Exchange Launch, all leaders receive <b>10 SLT-tokens</b>.
<b>1.4.</b>  At the beginning of each month before Smartlands Exchange Launch, TOP 3 leaders receive TOP-leadership bonuses: <b>100 SLT</b> for the first position, <b>50 SLT</b> for the second position, <b>25 SLT</b> for third. 

<b>2. Wallet:</b> 
<b>2.1.</b>  Get your Stellar Wallet at <a href='https://www.stellar.org/lumens/wallets/'>Stellar.org</a>.  
For Telegram, we recommend using @papayabot, for web base we recommend Stellarterm or Interstellar Exchange, for desktop we suggest Foxlet Wallet and for Android users just choose InterStellar-Stellar Lumens XLM Wallet and SDEX at Google Play.
<b>2.2.</b>  Save, write or take the picture of your Public Key and Secret Key, keep it safe.
<b>2.3.</b>  If you don't use @papayabot, you will need 2 to 5 XLM (Lumens) to activate your Stellar wallet.

<b>3. Trustline:</b> 
<b>3.1.</b>  Stellar wallet should have SLT-trustline created before withdrawal. 
<b>3.2.</b>  Create trustline for SLT. You can use federation url or manually type the asset code and issuer id.
Federation URL: smartlands.com
Asset Code: SLT
Issuer: GBOHLO3Y2ITB2G7BMUFL6VHFULRI2KOKYGQ2SNRBVSJ5ALFA2KDV6EVW

<b>4. Withdrawal:</b> 
<b>4.1.</b>  Welcome SLT can be withdrawn after Smartlands ICO. 
<b>4.2.</b>  Invitation and leadership SLT are withdrawable before Smartlands Exchange Launch.
<b>4.3.</b>  Earned SLT-tokens can be withdrawn into a Stellar wallet with established SLT trust line, or into @papayabot Telegram wallet.
`, {

                    parseMode: 'HTML'
                });
            });

    } else if (msg.text == '❌  Cancel Withdraw') {


        db.collection('telegram').updateOne({
                id: msg.from.id
            }, {
                $set: {
                    deleted: 0
                }
            },
            function(err, doc) {
                if (err) {
                    console.log(err);
                }

                let replyMarkup = bot.keyboard([
                    [bot.button('📚  Learn'), bot.button('☘️  SLT'), bot.button('🚀  Withdraw')],
                    [bot.button('💬  FAQ'), bot.button('📖  Conditions')]
                ], {
                    resize: true
                });

                return bot.sendMessage(msg.from.id, `Hello, ${ msg.from.first_name }! Welcome to Smartlands Bot ☘️. Leanr and Earn. Invite more friends - get more <b>SLT</b>`, {
                    replyMarkup,
                    parseMode: 'HTML'
                });

            });


    } else if (msg.text == '📚  Learn') {

        let replyMarkup = bot.keyboard([
            [bot.button('▶️  Lesson 1/3'), bot.button('▶️  Lesson 2/3'), bot.button('▶️  Lesson 3/3')],
            [bot.button('✅  Take the quiz'), bot.button('❌  Cancel learning')]
        ], {
            resize: true
        });


        bot.sendMessage(msg.from.id, `Watch 3 Smartlands Video-Lessons and Earn SLT:`, {
            replyMarkup,
            parseMode: 'HTML'
        });
        showVideo(msg.from.id, 1);


    } else if (msg.text == '❌  Cancel learning' || msg.text == '❌  Cancel quiz') {
        quizCounter = 1;
        quizSuccess = 0;
        let replyMarkup = bot.keyboard([
            [bot.button('📚  Learn'), bot.button('☘️  SLT'), bot.button('🚀  Withdraw')],
            [bot.button('💬  FAQ'), bot.button('📖  Conditions')]
        ], {
            resize: true
        });

        return bot.sendMessage(msg.from.id, `Good progress, ${ msg.from.first_name }! Watch video about Smartlands, take the quiz to get more <b>SLT</b>. Compete in LeaderBoards Race.`, {
            replyMarkup,
            parseMode: 'HTML'
        });


    } else if (msg.text == '✅  Take the quiz') {



        let replyMarkup = bot.keyboard([
            [bot.button('❌  Cancel quiz')]
        ], {
            resize: true,
            one_time_keyboard: true
        });


        bot.sendMessage(msg.from.id, `📗 SLT quiz started!`, {
                parseMode: 'HTML',
                replyMarkup
            })

            .then(function() {

                nextQuestion(msg.from.id);

            });




    } else if (msg.text == '▶️  Lesson 1/3') {
        showVideo(msg.from.id, 1)
    } else if (msg.text == '▶️  Lesson 2/3') {
        showVideo(msg.from.id, 2)
    } else if (msg.text == '▶️  Lesson 3/3') {
        showVideo(msg.from.id, 3)
    } else if (msg.text == '✅ Yes SEND') {
        console.log(1);
        console.log('sendTO: ', userAddress, userID, userAmount, userMemo, msg.from.username)

        if (msg.from.username == undefined) {
            msg.from.username = '';
        }


        sendSLT(userAddress, userID, userAmount, userMemo, msg.from.username);



    } else if (msg.text == '➕ Add MEMO') {




        db.collection('telegram').findOne({
            id: msg.from.id
        }, function(err, doc) {
            if (err) {
                console.log(err);
            }
            if (doc) {



                db.collection('telegram').updateOne({
                        id: doc.id
                    }, {
                        $set: {
                            deleted: 4
                        }
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }

                        let replyMarkup = bot.keyboard([
                            [bot.button('❌  Cancel Withdraw')]
                        ], {
                            resize: true
                        });
                        return bot.sendMessage(msg.from.id, `Input your <b>MEMO</b> to Address ID <b>${ userAddress }</b>
to which you want to send SLT:
<b>${parseFloat(( doc.total_balance ).toFixed(4)) } SLT</b> ☘️ available to Withdraw`, {
                            replyMarkup,
                            parseMode: 'HTML'
                        });

                    });



            }
        });
    }


    var trusttt = function() {
        return bot.sendMessage(msg.from.id, `<b>⚠️  In order to hold a balance of SLT asset, you first need to add a trustline for SLT asset in your wallet. </b> 

Use federation url or manually type the asset code and issuer id to create a trustline.
Federation URL: <b>smartlands.com</b>
Asset Code: <b>SLT</b>
Issuer: <b>GBOHLO3Y2ITB2G7BMUFL6VHFULRI2KOKYGQ2SNRBVSJ5ALFA2KDV6EVW</b>`, {
            parseMode: 'HTML'
        });

    }

    var notvalids = function() {

        if (msg.text != '❌  Cancel Withdraw' && msg.text != '✅ Yes SEND' && msg.text != '🚀  Withdraw' && msg.text != '➕ Add MEMO') {
            console.log('text:', msg.text);

            return bot.sendMessage(msg.from.id, `<b>⚠️  The Address your input is invalid.</b> 
Please input valid Stellar Public Address.`, {
                parseMode: 'HTML'
            });
        }

    }

    db.collection('telegram').findOne({
        id: msg.from.id
    }, function(err, doc) {
        if (err) {
            console.log(err);
        }

        if (doc && doc.deleted == "3") {


            var receiverPublicKey = msg.text;
            console.log(receiverPublicKey);

            var checkdbwallet = function(doc) {
                if (doc == msg.from.id) {
                    console.log('OLD', doc);


                    if (receiverPublicKey == 'GBR3RS2Z277FER476OFHFXQJRKYSQX4Z7XNWO65AN3QPRUANUASANG31') {
                        return bot.sendMessage(msg.from.id, `<b>⚠️  Unfortunately, this Address was used by another user,</b> 
please enter your original Address`, {
                            parseMode: 'HTML'
                        });
                    }
                }
            }

            var updatewallet = function(receiverPublicKey, dos) {

                console.log('NEW', receiverPublicKey, dos);


                sendSLT();


                db.collection('telegram').updateOne({
                    id: msg.from.id,
                }, {
                    $set: {
                        stellar_adress: receiverPublicKey
                    }
                });
            }




            if (StellarSdk.StrKey.isValidEd25519PublicKey(receiverPublicKey)) {
                var server = new StellarSdk.Server('https://horizon-testnet.stellar.org');
                var PUB_checkAc = receiverPublicKey;
                server.loadAccount(PUB_checkAc).then(function(account) {
                    console.log('rec', receiverPublicKey);




                    console.log('SUCCESS!', account);
                    for (var i = 0; i < account.balances.length; i = i + 1) {
                        if (account.balances[i].asset_code == "SLT") {

                            var tokk = 1;
                        }

                        if (i == (account.balances.length - 1) && tokk != 1) {
                            trusttt();
                        }

                        if (i == (account.balances.length - 1) && tokk == 1) {

                            db.collection('telegram').findOne({
                                id: msg.from.id
                            }, function(err, doc) {
                                if (err) {
                                    console.log(err);
                                }

                                console.log('RECIEVER:', account.signers[0]);

                                if ((doc.welcome_bonus + doc.invitations_bonus) > 0) {

                                    var tokk = 0;

                                    var send_amount = parseFloat(doc.invitations_bonus + doc.welcome_bonus + doc.quiz_bonus);


                                    let replyMarkup = bot.keyboard([
                                        [bot.button('✅ Yes SEND'), bot.button('➕ Add MEMO')],
                                        [bot.button('❌  Cancel Withdraw')]
                                    ], {
                                        resize: true
                                    });
                                    userAddress = account.signers[0].key;
                                    userID = msg.from.id;
                                    userMemo = '';
                                    userAmount = send_amount;
                                    console.log('sendTO: ', userAddress, userID, userAmount, 'noMemo')
                                    return bot.sendMessage(msg.from.id, `🚀  Confirm Withdraw <b>${ send_amount } SLT</b> to Address:
<b>${ account.signers[0].key }</b>`, {
                                        parseMode: 'HTML',
                                        replyMarkup
                                    });




                                } else {
                                    let replyMarkup = bot.keyboard([
                                        [bot.button('📚  Learn'), bot.button('☘️  SLT'), bot.button('🚀  Withdraw')],
                                        [bot.button('💬  FAQ'), bot.button('📖  Conditions')]
                                    ], {
                                        resize: true
                                    });
                                    return bot.sendMessage(msg.from.id, `Dear ${ msg.from.first_name }, please invite friends to get SLT ☘️`, {
                                        replyMarkup,
                                        parseMode: 'HTML'
                                    });
                                }
                            });
                        }
                    }




                }).catch(function(err) {
                    console.log('wallet error', err)
                });


                db.collection('telegram').findOne({
                    stellar_adress: receiverPublicKey
                }, function(err, doc) {
                    if (err) {
                        console.log(err);

                    } else {

                        if (doc == null) {
                            updatewallet(receiverPublicKey, doc);
                        } else {
                            checkdbwallet(doc.id);

                        }
                    }
                });

            } else {
                notvalids();
            }


            //MEMO RECIEVER  
        } else if (doc && doc.deleted == "4") {



            if (msg.text != '❌  Cancel Withdraw') {

                db.collection('telegram').updateOne({
                        id: doc.id
                    }, {
                        $set: {
                            deleted: 0
                        }
                    },
                    function(err, result) {
                        if (err) {
                            console.log(err);
                        }
                    });


                userMemo = msg.text;
                console.log('RECIEVED MEMO: ', userMemo);

                let replyMarkup = bot.keyboard([
                    [bot.button('✅ Yes SEND'), bot.button('❌  Cancel Withdraw')]
                ], {
                    resize: true
                });
                return bot.sendMessage(msg.from.id, `🚀  Confirm Withdraw <b>${parseFloat(( doc.total_balance ).toFixed(4)) } SLT</b> to Address: <b>${ userAddress}</b>
with MEMO: <b>${ userMemo }</b>`, {
                    replyMarkup,
                    parseMode: 'HTML'
                });


            }


        }


    });
});



bot.on('leftChatMember', (msg) => {
    console.log('WARNING:  ', msg);
    console.log(msg.left_chat_member.username, ' left group');
    db.collection('telegram').deleteOne({
            id: msg.left_chat_member.id
        },
        function(err, result) {
            if (err) {
                console.log(err);
            }
            console.log(msg.left_chat_member.username, ' deleted');
        });
});


bot.on('newChatMembers', (msg) => {
    console.log('msg.chat.username:', msg.chat.username);

    if (msg.chat.username == 'smartlandstest') {


        var invited_count = Object.keys(msg.new_chat_members).length;
        console.log('MESSAGE:', msg);
        console.log('INVITEDCOUNT:', invited_count);


        if (invited_count == 1) {
            if (msg.new_chat_member.username == undefined) {
                msg.new_chat_member.username == ''
            }
            if (msg.new_chat_member.first_name == undefined) {
                msg.new_chat_member.first_name == ''
            }
            if (msg.new_chat_member.last_name == undefined) {
                msg.new_chat_member.last_name == ''
            }


            if (!msg.new_chat_member.is_bot || msg.new_chat_member.id == 'CoinrankingOfficialBot') {


                //если пользователь пришел сам       
                if (msg.new_chat_member.id == msg.from.id) {

                    console.log('Один пользователь пришел сам', msg.from.id);


                    db.collection('telegram').findOne({
                        id: msg.from.id
                    }, function(err, doc) {
                        if (err) {
                            console.log(err);
                        }

                        if (doc) {
                            console.log('Ранее замечен');

                            db.collection('telegram').updateOne({
                                    id: doc.id
                                }, {
                                    $set: {
                                        id: msg.from.id,
                                        first_name: msg.new_chat_member.first_name,
                                        last_name: msg.new_chat_member.last_name,
                                        username: msg.new_chat_member.username,
                                        welcome_bonus: 1,
                                        invited_users: [],
                                        invitations_count: 0,
                                        invitations_bonus: 0,
                                        quiz_bonus: 0,
                                        leader_bonus: 0,
                                        total_balance: 1,
                                        stellar_adress: '',
                                        ether_adress: '',
                                        quizpass: 0,
                                        deleted: 0
                                    }
                                },



                                function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    }

                                    console.log(result, msg.new_chat_member.username, ' joined group');
                                    msg.reply.text(`Hello, ${ msg.new_chat_member.first_name }, and welcome aboard to the Smartlands's Official Community! A place to discuss the various news, events, releases and updates from Smartlands Blockchain Multi Payments. Congratulations, you got<b> 1 SLT</b> ☘️ as welcome bonus!`, {
                                        asReply: true,
                                        parseMode: 'HTML'
                                    });
                                });


                        } else {
                            console.log('Не замечен ранее');

                            db.collection('telegram').insert({
                                    id: msg.new_chat_member.id,
                                    first_name: msg.new_chat_member.first_name,
                                    last_name: msg.new_chat_member.last_name,
                                    username: msg.new_chat_member.username,
                                    welcome_bonus: 1,
                                    invited_users: [],
                                    invitations_count: 0,
                                    invitations_bonus: 0,
                                    leader_bonus: 0,
                                    quiz_bonus: 0,
                                    total_balance: 1,
                                    stellar_adress: '',
                                    ether_adress: '',
                                    quizpass: 0,
                                    deleted: 0
                                },



                                function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    }

                                    console.log(result, msg.new_chat_member.username, ' joined group');
                                    msg.reply.text(`Hello, ${ msg.new_chat_member.first_name }, and welcome aboard to the Smartlands's Official Community! A place to discuss the various news, events, releases and updates from Smartlands Blockchain Multi Payments. Congratulations, you got<b> 1 SLT</b> ☘️ as welcome bonus!`, {
                                        asReply: true,
                                        parseMode: 'HTML'
                                    });
                                });


                        }
                    });


                } else {
                    console.log('Один пользователя пригласил другого');
                    console.log('Начисляем 1 тому кто приглашал');

                    db.collection('telegram').findOne({
                        id: msg.from.id
                    }, function(err, doc) {
                        if (err) {
                            console.log(err);
                        }

                        if (doc) {
                            var inv_cnt = parseFloat((doc.invitations_count + invited_count).toFixed(4));
                            var inv_bns = parseFloat((doc.invitations_bonus + (invited_count / 10)).toFixed(4));
                            var ttl_bls = parseFloat((doc.invited_users.concat(msg.new_chat_members)).toFixed(4));

                            db.collection('telegram').updateOne({
                                    id: doc.id
                                }, {
                                    $set: {
                                        invited_users: doc.invited_users.concat(msg.new_chat_members),
                                        invitations_count: inv_cnt,
                                        invitations_bonus: inv_bns,
                                        total_balance: ttl_bls
                                    }
                                },
                                function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
                        } else {

                            if (msg.from.username == undefined) {
                                msg.from.username == ''
                            }
                            if (msg.from.first_name == undefined) {
                                msg.from.first_name == ''
                            }
                            if (msg.from.last_name == undefined) {
                                msg.from.last_name == ''
                            }

                            console.log('старый гость стал инвайтером');
                            db.collection('telegram').insert({
                                    id: msg.from.id,
                                    first_name: msg.from.first_name,
                                    last_name: msg.from.last_name,
                                    username: msg.from.username,
                                    welcome_bonus: 1,
                                    invited_users: [],
                                    invitations_count: 0,
                                    invitations_bonus: 0,
                                    leader_bonus: 0,
                                    quiz_bonus: 0,
                                    total_balance: 1,
                                    stellar_adress: '',
                                    ether_adress: '',
                                    quizpass: 0,
                                    deleted: 0
                                },
                                function(err, result) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    console.log('RESULTAT', result);

                                    db.collection('telegram').findOne({
                                        id: msg.from.id
                                    }, function(err, doc) {
                                        if (err) {
                                            console.log(err);
                                        }



                                        db.collection('telegram').updateOne({
                                                id: doc.id
                                            }, {
                                                $set: {
                                                    invited_users: doc.invited_users.concat(msg.new_chat_members),
                                                    invitations_count: parseFloat((doc.invitations_count + invited_count).toFixed(4)),
                                                    invitations_bonus: parseFloat((doc.invitations_bonus + (invited_count / 10)).toFixed(4)),
                                                    total_balance: parseFloat((doc.welcome_bonus + doc.leader_bonus + (invited_count / 10)).toFixed(4)),
                                                    leader_bonus: parseFloat((doc.leader_bonus).toFixed(4))
                                                }
                                            },
                                            function(err, result) {
                                                if (err) {
                                                    console.log(err);
                                                }
                                            });
                                    });
                                });
                        }
                    });

                    console.log('Добавляем в базу того кого пригласили и начисляем 10');
                    db.collection('telegram').insert({
                            id: msg.new_chat_member.id,
                            first_name: msg.new_chat_member.first_name,
                            last_name: msg.new_chat_member.last_name,
                            username: msg.new_chat_member.username,
                            welcome_bonus: 1,
                            invited_users: [],
                            invitations_count: 0,
                            invitations_bonus: 0,
                            quiz_bonus: 0,
                            leader_bonus: 0,
                            total_balance: 1,
                            stellar_adress: '',
                            ether_adress: '',
                            quizpass: 0,
                            deleted: 0
                        },
                        function(err, result) {
                            if (err) {
                                console.log(err);
                            }
                            console.log(result, msg.new_chat_member.username, ' joined group');
                            msg.reply.text(`Hello, <b>${ msg.new_chat_member.first_name }</b>, and welcome aboard to the Smartlands's Official Community! A place to discuss the various news, events, releases and updates from Smartlands Blockchain Multi Payments. Congratulations, ${ msg.new_chat_member.first_name }, you got <b>1 SLT</b> ☘️ as welcome bonus! <b>+ 1 SLT ☘️ to ${ msg.from.first_name }</b> for the invitation.`, {
                                asReply: true,
                                parseMode: 'HTML'
                            });
                        });


                }

            } else {
                console.log('Спалили бота и удалили');
                bot.kickChatMember('@SLT_2', msg.new_chat_member.id).then(function(data) {
                    console.log('bot detected: ', msg.new_chat_member.username);
                });
            }

        } else {

            console.log('Пригласили нескольких');


            db.collection('telegram').findOne({
                id: msg.from.id
            }, function(err, doc) {
                if (err) {
                    console.log(err);
                }

                if (doc) {
                    db.collection('telegram').updateOne({
                            id: doc.id
                        }, {
                            $set: {
                                invited_users: doc.invited_users.concat(msg.new_chat_members),
                                invitations_count: parseFloat((doc.invitations_count + invited_count).toFixed(4)),
                                invitations_bonus: parseFloat((doc.invitations_bonus + (invited_count / 10)).toFixed(4)),
                                total_balance: parseFloat((doc.welcome_bonus + doc.leader_bonus + (invited_count / 10)).toFixed(4))
                            }
                        },
                        function(err, result) {
                            if (err) {
                                console.log(err);
                            }

                        });
                } else {

                    if (msg.from.username == undefined) {
                        msg.from.username == ''
                    }
                    if (msg.from.first_name == undefined) {
                        msg.from.first_name == ''
                    }
                    if (msg.from.last_name == undefined) {
                        msg.from.last_name == ''
                    }

                    console.log('старый гость стал инвайтером');
                    db.collection('telegram').insert({
                            id: msg.from.id,
                            first_name: msg.from.first_name,
                            last_name: msg.from.last_name,
                            username: msg.from.username,

                            invited_users: [0],
                            invitations_count: 0,
                            invitations_bonus: 0,
                            leader_bonus: 0,
                            quiz_bonus: 0,
                            stellar_adress: '',
                            ether_adress: '',
                            quizpass: 0,
                            deleted: 0
                        },
                        function(err, result) {
                            if (err) {
                                console.log(err);
                            }
                            console.log('RESULTAT', result);
                            db.collection('telegram').findOne({
                                id: msg.from.id
                            }, function(err, doc) {
                                if (err) {
                                    console.log(err);
                                }

                                db.collection('telegram').updateOne({
                                        id: doc.id
                                    }, {
                                        $set: {
                                            invited_users: doc.invited_users.concat(msg.new_chat_members),
                                            invitations_count: parseFloat((doc.invitations_count + invited_count).toFixed(4)),
                                            invitations_bonus: parseFloat((doc.invitations_bonus + (invited_count / 10)).toFixed(4)),
                                            total_balance: parseFloat((doc.welcome_bonus + (invited_count / 10) + doc.leader_bonus).toFixed(4))
                                        }
                                    },
                                    function(err, result) {
                                        if (err) {
                                            console.log(err);
                                        }
                                    });
                            });
                        });
                }

            });

            var names = '';
            for (i = 0; i < invited_count; i++) {
                const count = i;
                console.log('nah', count);
                if (msg.new_chat_members[count].username == undefined) {
                    msg.new_chat_members[count].username == 'anonimous';
                }
                if (msg.new_chat_members[count].first_name == undefined) {
                    msg.new_chat_members[count].first_name == 'anonimous';
                }
                if (msg.new_chat_members[count].last_name == undefined) {
                    msg.new_chat_members[count].last_name == 'anonimous';
                }

                if (!msg.new_chat_members[count].is_bot) {
                    if (msg.new_chat_members[count].first_name != 'anonimous') {
                        names = names + msg.new_chat_members[count].first_name + ', ';
                    }

                    db.collection('telegram').insert({
                            id: msg.new_chat_members[count].id,
                            first_name: msg.new_chat_members[count].first_name,
                            last_name: msg.new_chat_members[count].last_name,
                            username: msg.new_chat_members[count].username,
                            welcome_bonus: 1,
                            invited_users: 0,
                            invitations_count: 0,
                            invitations_bonus: 0,
                            leader_bonus: 0,
                            quiz_bonus: 0,
                            total_balance: 1,
                            stellar_adress: '',
                            ether_adress: '',
                            quizpass: 0,
                            deleted: 0
                        },

                        function(err, result) {
                            if (err) {
                                console.log(err);
                            }
                        });
                } else {
                    console.log('Спалили бота и удалили');
                    bot.kickChatMember('@SLT_2', msg.new_chat_members[i].id).then(function(data) {
                        console.log('bot detected: ', msg.new_chat_members[i].username);
                    });
                }
            }
            msg.reply.text(`Hello, ${ names }and welcome aboard to the Smartlands's Official Community! A place to discuss the various news, events, releases and updates from Smartlands Blockchain Multi Payments. Congratulations, you all got <b>1 SLT</b> ☘️ as welcome bonus! + ${ invited_count/10 } <b>SLT</b> ☘️ to ${ msg.from.first_name } for the invitation.`, {
                asReply: true,
                parseMode: 'HTML'
            });
        }
    }
});


bot.on('/hello', (msg) => {
    return bot.sendMessage(msg.from.id, `Hello, ${ msg.from.first_name }!`);
});

bot.on('sticker', (msg) => {});

MongoClient.connect('mongodb://localhost:27017/telegram', function(err, database) {
    if (err) {
        return console.log(err);
    }
    db = database;

    app.listen(3013, function() {
        console.log('Database started');
    })

});

bot.start();