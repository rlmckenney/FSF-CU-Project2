const path = require('path')
const router = require('express').Router()
const { User } = require('../models')

router.post('/', async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    if (req.files && req.files.avatar) {
      const avatar = req.files.avatar
      // Prepend the fileName with the User.id to prevent naming collisions
      // with other users uploading files with the same name.
      const fileName = `${user.id}_${avatar.name}`
      // Move the file from the tmp location to the public folder.
      await avatar.mv(path.join(__dirname, '..', 'public', 'avatars', fileName))
      // Record the public URL on the User model and store it in the database.
      user.avatarUrl = `/avatars/${fileName}`
      user.save()
    }
    // Display the newly created user's Profile view.
    res.redirect(`/users/${user.id}`)
  } catch (err) {
    next(err)
  }
})

router.get('/register', (req, res) => res.render('user-register'))

router.get('/:id', async (req, res, next) => {
  User.findByPk(req.params.id)
    .then(user => res.render('user-profile', user.toJSON()))
    .catch(next)
})

module.exports = router
