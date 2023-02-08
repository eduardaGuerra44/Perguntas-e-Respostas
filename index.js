const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Pergunta = require('./models/Pergunta');
const Resposta = require('./models/Resposta');

//CONECTANDO O DB 
const connection = require('./database/database');
connection.authenticate()
    .then(() => { console.log("conexão feita com o db") })
    .catch((msgerro) => { console.log(msgerro) })

//configirando ejs 
app.set('view engine', 'ejs')
//configurando arquivo estático
app.use(express.static('public'))

// //bodyParser
app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json)

// rotas 
app.get('/', (req, res) => {
    //pesquisando perguntas e armazenando em uma variável. jogando para a pág home
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'desc']]
    }).then(perguntas => {
        res.render('index.ejs',
            {
                perguntas: perguntas
            })
    })
});


app.get('/perguntar', (req, res) => res.render('perguntar.ejs'))

//rota que recebe infos do formulário
app.post("/salvarpergunta", (req, res) => {
    const titulo = req.body.titulo;
    const descricao = req.body.descricao;
    //salvando no db a pergunta
    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    })
        // se salva com sucesso redireciona para a home
        .then(() => {
            res.redirect('/')
        })
});

//acessando pergunta por id
app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) {

            Resposta.findAll({
                where: { perguntaId: pergunta.id },
                order:[['id', 'DESC']]
            }).then(respostas => {
                res.render('pergunta.ejs', {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        } else {
            res.redirect('/')
        }
    })
});

app.post('/responder', (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/pergunta/' + perguntaId)
    })
})


app.listen(3000, () => console.log('app rodando'))