[![Build Status](https://travis-ci.com/rlmckenney/FSF-CU-Project2.svg?branch=master)](https://travis-ci.com/rlmckenney/FSF-CU-Project2)

**Carleton University &ndash; Coding Bootcamp**

Robert McKenney | _Instructor_

# Project 2 &ndash; Demo

Intro goes here ...

## Create new Model with image upload

Add notes here ...

## Update image for Model

When you want to change the image associated to an existing Model instance, there are several ways that you could implement it. Let's look at two options.

### Method Spoofing

Since the browser native HTML forms only support GET and POST methods, you can add an additional parameter to your POST request to indicate the real RESTful HTTP verb that you need. This can be done by adding a hidden form field e.g.

```html
<form action="/users" method="post" enctype="multipart/form-data">
  <input type="hidden" name="method" value="PATCH" />
  <input type="file" name="avatar" id="avatar" />
  <!-- the rest of your form -->
</form>
```

Then in your route handler, you can check for this property on `req.body` and then hand-off to the correct method function.

```js
app.post('/users', (req, res, next) => {
  if (req.body.method && req.body.method === 'PATCH') {
    return updateUser(req, res, next)
  }
  return createUser(req, res, next)
})

async function createUser (req, res, next) {
  /** ... */
}
async function updateUser (req, res, next) {
  /** ... */
}
```

### Call API route with fetch

Alternatively, you could upload the form data programmatically to a standard RESTful API route using `fetch` with a [FormData()](https://developer.mozilla.org/en-US/docs/Web/API/FormData/FormData) object.

```js
const formData = new FormData()
const fileField = document.getElementById('avatar')
formData.append('avatar', fileField.files[0])

fetch(`/api/users/${user.id}`, {
  method: 'PATCH',
  body: formData
})
  .then(response => response.json())
  .then(result => {
    /** do stuff with the result */
  })
  .catch(console.error)
```
