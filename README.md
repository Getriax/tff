

* [Auth](#auth-routes)
* [User](#user-routes)
* [Skills](#skills-routes)
* [Employee](#employee-routes)
* [Emloyer](#employer-routes)
* [Company](#company-routes)
* [Ask](#ask-routes)
* [Bid](#bid-routes)

### Auth routes
**POST** `/api/auth/login`

String: **username**

String **password**

    { 
	    "token": "auth token string" 
    }


----------


**POST** `/api/auth/register`

String **username**

String **password**


String **email**

    { 
	    "token": "auth token string" 
    }
	
**OR** if error

    { 
	    "message": "reason" 
    }
    
    
----------
**POST** `/api/auth/check-email`
> Checks if email is available 
String **email**

    { 
	    "success": "good" 
    }
    
**OR** if error

    { 
	    "message": "Email already registered" 
    }

----------
**POST** `/api/auth/check-username`
> Checks if user name is available 

String: **username**


    { 
	    "success": "good" 
    }
    
**OR** if error

    { 
	    "message": "Name already in use" 
    }

----------

**GET** `/api/auth/id`

> Auth header required

    {
		"user_id": "5a9df8f1d1db7a0b3c98a713"
	}


----------


### User routes
> Auth header required in all routes

**GET** `/api/user/all`

    [
        {
            "rate": [],
            "username": "niko1",
            "email": "some@ema2il.com",
            "city": "Sepolno3",
            "phone": "555983212",
            "last_name": "French2",
            "first_name": "English1",
            "status": 0
        },
        {
            "rate": [],
            "**username**": "niko",
            "email": "some@ema2il.com"
			"status": "-1"
        },
        {
            "rate": [],
            "**username**": "niko23",
            "email": "some@ema2il.com"
			"status": "-1"
        }
    ]


----------


**GET** 
* `/api/user/:id` 
* `/api/user/me`

> If user is of status 0 - employee data will be added, status 1 - empoyer data will be added

**:id** - id of user to GET - **me** stands for logged in user
> Example of status 0

    {
	    "user": {
	        "rate": [],
	        "username": "niko1",
	        "email": "some@ema2il.com",
	        "city": "Sepolno3",
	        "phone": "555983212",
	        "last_name": "French2",
	        "first_name": "English1",
	        "status": 0
	    },
	    "employee": {
	        "bids": [],
	        "languages": [
	            {
	                "name": "English"
	            },
	            {
	                "name": "French"
	            }
	        ],
	        "software": [
	            {
	                "name": "Eclipse"
	            },
	            {
	                "name": "Photoshop"
	            }
	        ],
	        "specs": [
	            {
	                "name": "Java"
	            },
	            {
	                "name": "C++"
	            }
	        ],
	        "certifications": [
	            {
	                "name": "CISCO2"
	            },
	            {
	                "name": "CISCO1"
	            }
	        ]
	    }
    }


----------


**POST** `/api/user/password`

String **password**

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON


----------


### Skills routes
> Auth header required in all routes

**GET** 
* `/api/skills/categories`
* `/api/skills/languages` 
* `/api/skills/software` 
* `/api/skills/specializations` 
* `/api/skills/certifications`

certifications doesn't have level property - all the rest is the same languages example

    [
	    {
	        "name": "Spanish"
			"level": "B"
	    },
	    {
	        "name": "English"
	    },
	    {
	        "name": "French"
	    },
	    {
	        "name": "Italian"
	    }
	]


----------


### Employee routes
> Auth header required in all routes

**POST** /api/employee/create

String **first_name**

String **last_name**

String **phone**

String **city**

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
----------

**POST** `/api/employee/update`

* String **description**
* String **portfolio_link**
* String **git_link**
* String **linked_in_link**
* Number **salary**
* String **education**
* Array[String] **categories** 
* Array[String] **languages** 
* Array[String] **software**
* Array[String] **specs**
* Array[String] **certifications**

>Example array would be { languages: ['English', 'Spanish'] }


> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
	
----------



### Employer routes
> Auth header required in all routes

**POST** `/api/employer/create`

* String **first_name**
* String **last_name**
* String **phone**
* String **city**

    
> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
	  	  
----------
**POST** `/api/employer/update`

* String **git_link**
* String **linked_in_link**

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON

----------

**GET**
*  `/api/employer/asks/my` - returns all asks of logged user
*  `/api/employer/asks/:id` - returns all asks of employer with given id

**:id** - id of a employer to get asks from.

    
    [
		    {
		        "bids": [],
		        "is_active": true,
		        "is_complete": false,
		        "creation_date": "2018-03-13T18:03:18.306Z",
		        "languages": [],
		        "software": [],
		        "specs": [],
		        "certifications": [],
		        "categories": [],
		        "_id": "5aa814425367262b5634bd33",
		        "description": "opis",
		        "salary": 1500,
		        "work_time": 12,
		        "employer": "5aa7f6fc696ead16a3deb1c8",
		        "__v": 0
		    },
		    {
		        "bids": [],
		        "is_active": true,
		        "is_complete": false,
		        "creation_date": "2018-03-13T18:03:18.306Z",
		        "languages": [],
		        "software": [],
		        "specs": [],
		        "certifications": [],
		        "categories": [
		            {
		                "name": "Android developer"
		            },
		            {
		                "name": "Web developer"
		            }
		        ],
		        "_id": "5aa816115367262b5634bd34",
		        "description": "opis",
		        "salary": 1500,
		        "work_time": 12,
		        "employer": "5aa7f6fc696ead16a3deb1c8",
		        "__v": 0
		    }
    ]


----------  

**GET**  
* `/api/employer/companies/my` - returns all companies of logged user.
* `/api/employer/companies/:id` - returns all companies of employer with given id

 **:id** - id of employer to get companies from.

	    [
		    {
		        "_id": "5aa80434696ead16a3deb1cb",
		        "employer": "5aa7f6fc696ead16a3deb1c8",
		        "name": "firma1",
		        "NIP": "123",
		        "city": "dc",
		        "__v": 0
		    }
	    ]


----------


### Company routes
> Auth header required in all routes

**POST** `/api/company/create`

* String **name**
* String **NIP** > UNIQUE - if duplicate returns **message**
* String **city**

    
> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON

----------
**POST** `/api/company/update/:id`

* **:id** - id of company to update
* String **name**
* String **NIP** 
* String **city**

   
> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
----------
**POST** `/api/company/delete/:id`

* **:id** - id of company to delete
* String **NIP**
    
> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON

----------
**GET**  `/api/company/:id`
* **:id** - id of company to get.

	    {
		    "_id": "5aa80434696ead16a3deb1cb",
		    "employer": "5aa7f6fc696ead16a3deb1c8",
		    "name": "firma1",
		    "NIP": "123",
		    "city": "dc",
		    "__v": 0
	    }

----------

### Ask routes
> Auth header required in all routes

**GET** `/api/ask/all`


    [
	    {
	        "bids": [],
	        "languages": [
	            {
	                "name": "English"
	            },
	            {
	                "name": "French"
	            }
	        ],
	        "software": [
	            {
	                "name": "Photoshop"
	            },
	            {
	                "name": "Web Storm"
	            }
	        ],
	        "specs": [],
	        "certifications": [],
	        "_id": "5aa42a0861ba6718ae25c7b4",
	        "employer": {
	            "asks": [
	                "5aa42a0861ba6718ae25c7b4"
	            ],
	            "company": [],
	            "_id": "5aa41cf16bb9a816cc7b880c",
	            "user_id": "5aa40ded85f618149ea77e46",
	            "__v": 21
	        },
	        "description": "ASK2",
	        "salary": 1012,
	        "work_time": 2411,
	        "is_active": true,
	        "is_complete": false,
	        "__v": 0
	    }
    ]


----------

**GET** `/api/ask/:id`
* **:id** - id of ask to show
> Example route `/api/ask/5aa42a0861ba6718ae25c7b4`

    {
	    "bids": [],
	    "languages": [
	        {
	            "name": "English"
	        },
	        {
	            "name": "French"
	        }
	    ],
	    "software": [
	        {
	            "name": "Photoshop"
	        },
	        {
	            "name": "Web Storm"
	        }
	    ],
	    "specs": [],
	    "certifications": [],
	    "_id": "5aa42a0861ba6718ae25c7b4",
	    "employer": {
	        "asks": [
	            "5aa42a0861ba6718ae25c7b4"
	        ],
	        "company": [],
	        "_id": "5aa41cf16bb9a816cc7b880c",
	        "user_id": "5aa40ded85f618149ea77e46",
	        "__v": 21
	    },
	    "description": "ASK2",
	    "salary": 1012,
	    "work_time": 2411,
	    "is_active": true,
	    "is_complete": false,
	    "__v": 0
    }


----------
**POST** `/api/ask/create`
* String **description**
* Number **salary**
* Number **work_time**
* Array[String] **categories** 
* Array[String] **languages**
* Array[String] **software**
* Array[String] **specs**
* Array[String] **certifications**

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON


----------
**POST** `/api/ask/update/:id`
* **:id** - id of ask to update
* String **description**
* Number **salary**
* Number **work_time**
* Array[String] **categories** 
* Array[String] **languages**
* Array[String] **software**
* Array[String] **specs**
* Array[String] **certifications**

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
----------
**POST** `/api/ask/delete/:id`

* **:id** - id of ask to remove

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
----------
### Bid routes
> Auth header required in all routes

**POST** `/api/bid/create/:id`

* **:id** - id of ask to bid to
* String **description**
* Number **salary**

> Returns **success** if all went fine or **message** if error interrupted the post - both types are JSON
