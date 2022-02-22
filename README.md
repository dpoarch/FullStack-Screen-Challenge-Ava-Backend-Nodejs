## FullStack-Screen-Challenge-Ava-Backend-Nodejs

## Instructions

You can install this project by doing the following:

1.Download this repo.

2.Unzip the file.

3.Open `FullStack-Screen-Challenge-Ava-Backend-Nodejs` directory

4.Open CLI and run the following:

```sh

 npm install
 npm start

```

The project will now run at: localhost:4000

## API routes

```php

 [GET] localhost:4000/ping
 [GET] localhost:4000/conversations
 [GET] localhost:4000/info

```

```php

 [POST] localhost:4000/mutations

```


```php

[Request Body]
{
	"author": "alice | bob",
	"origin": {
    // Get the latest mutation of the conversation first
    "alice": "number", // should be incremented if this mutation is requested by alice.
    "bob": "number" // should be incremented if this mutation is requested by bob.
  },
	"conversationId": "",
	"data": {
		"type": "insert | delete",
		"index": "number", // the start index where the mutation will be applied
		"length": "number | undefined", // the length of the text which will inserted or deleted
		"text": "string | undefined", // the text which will be inserted or deleted
	}
}


```