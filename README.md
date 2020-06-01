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

## Using debug tools

Every JavaScript developer starts learning to debug their code with `console.log()`, and that works well for smaller applications. But as your project grows in complexity, it is time for better tools.

### In the browser

The developer tools in Chrome and FireFox have great built-in debugger tools. This short [Introduction to Debugger](https://mozilladevelopers.github.io/playground/debugger) tutorial from Mozilla will introduce you to the value and power of these tools.

### VS Code's debugger for Node.js

Now that you have a better idea of how and why to use a debug tool in the browser, you probably want to know if you can use it on the server side with node? **The answer is, yes.**

Start with this 8 minute intro video called [Getting started with Node.js debugging in VS Code](https://www.youtube.com/watch?v=2oFKNL7vYV8). Then have a look at the official [Debugging User Guide](https://code.visualstudio.com/docs/editor/debugging).

#### launch.json

Here is an example `launch.json` file with two different options. The first uses a globally installed version of `nodemon` and let's you add access to the debugger to your existing workflow. The second will launch a `node server` command and attach the debugger. You can start, stop, and restart the server using the debug controls.

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "nodemon",
      "runtimeExecutable": "nodemon",
      "program": "${workspaceFolder}/server.js",
      "restart": true,
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen",
      "skipFiles": ["<node_internals>/**"]
    },

    {
      "type": "node",
      "request": "launch",
      "name": "Launch Server",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/server.js"
    }
  ]
}
```

Now experiment with the debugger using your last project to get more comfortable with how it works.
