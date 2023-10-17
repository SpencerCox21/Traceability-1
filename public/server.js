const express = require('express')
const app = express()
const path = require('path')


// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: '1890f1f5fd15492eb8dc68759a0f7efb',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')




app.use(express.json())

const students = ['Jimmy', 'Timmy', 'Tommy']

app.get('/', (req, res) => {
    rollbar.info('Someone is using the app.')
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/api/students', (req, res) => {
    res.status(200).send(students)
})

app.post('/api/students', (req, res) => {
   let {name} = req.body

   rollbar.info('Someone is adding a student!')

   const index = students.findIndex(student => {
       return student === name
   })

   try {
       if (index === -1 && name !== '') {
           students.push(name)
           res.status(200).send(students)
       } else if (name === ''){
            rollbar.warning('The User tried to enter in a nameless student.')
            res.status(400).send('You must enter a name.')
       } else {
            rollbar.critical('The User added in a student that already exists.')
            res.status(400).send('That student already exists.')
       }
   } catch (err) {
       console.log('Student Submission error: student submittion function did not work.')
       rollbar.critical('Student Submission error: student submittion function did not work.')
   }
})

app.delete('/api/students/:index', (req, res) => {
    const targetIndex = +req.params.index
    
    students.splice(targetIndex, 1)
    res.status(200).send(students)
})

const port = process.env.PORT || 5050

app.listen(port, () => console.log(`Server listening on ${port}`))
