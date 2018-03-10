
* [Auth](#auth-routes)
* [User](#user-routes)
* [Skills](#skills-routes)
* [Employee](#employee-routes)
* [Emloyer](#employer-routes)
* [Company](#company-routes)

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

    { 
	    "success": "password updated" 
    }


----------


### Skills routes
> Auth header required in all routes

**GET** 
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

      {
	  	"success": "Employee created"
	}


----------

**POST** `/api/employee/update`

* String **description**
* String **portfolio_link**
* String **git_link**
* String **linked_in_link**
* Number **salary**
* String **education**
* Array[String] **languages** 
* Array[String] **software**
* Array[String] **specs**
* Array[String] **certifications**

>Example array would be { languages: ['English', 'Spanish'] }


	{
		"success": "Updated"
	}
	
> **OR** if error

	{
		"message": "reason"
	}
	
----------



### Employer routes
> Auth header required in all routes

**POST** `/api/employer/create`

* String **first_name**
* String **last_name**
* String **phone**
* String **city**

    
	  {
	  	"success": "Employer created"
	  }
	  
	  
----------

### Company routes
> Auth header required in all routes

**POST** `/api/company/create`

* String **name**
* String **NIP** > UNIQUE - if duplicate returns **message**
* String **city**

    
	  {
	  	"success": "Company created"
	  }

----------
**POST** `/api/company/update`

* String **name**
* String **NIP** > Update is based on NIP
* String **city**

    
	  {
	  	"success": "Company updated"
	  }
	  
----------
**POST** `/api/company/delete`

* String **NIP**
    
	  {
	  	"success": "Company deleted"
	  }
