const gulp = require('gulp'),
      mongoose = require('mongoose'),
      user = require('./models/user'),
      database = require('./services/database'),
      id = mongoose.Types.ObjectId,
    Language = require('./models/language'),
    Spec = require('./models/spec'),
    Software = require('./models/software'),
    Certification = require('./models/certification'),
    Category = require('./models/category'),
    Employee = require('./models/employee'),
    Employer = require('./models/employer'),
    Bid = require('./models/bid'),
    Message = require('./models/message'),
    skillsService = require('./services/skillsService');

gulp.task('addUser', (done) => {
    database.open(() => {});

    let usr = new user({
        username: 'glory',
        password: 'boyz',
        email: 'some@wp.pl'
    });

    usr.save((err) => {console.log('User saved')});
})

gulp.task('json', (done) => {
    usr = {
        "rate": [],
        "_id": "5a9d82812d1c730803c4ae3e",
        "username": "niko",
        "password": "$2a$10$yzOB1.lFt1Uus/PHgRLDxOarRsJxvUHI2HJpeqcRFgifevtRvEzoC",
        "email": "some@email.com",
        "__v": 0,
        "city": "Sepolno",
        "phone": "555983212",
        "last_name": "Ja",
        "first_name": "Nikodem",
        "status": 0
    }

    for(let key in usr) {
        if(usr[key] != 0) {
            console.log(key);
        }
    }

});

gulp.task('table', (done) => {
   let tab = new Array('Ala', 'Ana', 'Ama');

   let one = tableContains(tab, 'Ala');
   let two = tableContains(tab, 'Ela');

   console.log({
       o: one,
       t: two
   });

   let tab2 = tab.filter(el => el != 'Ala');
   console.log(tab2);
});

gulp.task('skills', (done) => {
    database.open(() => {});

    Language.create({name: 'English'}, (err) => {});
    Language.create({name: 'Spanish'}, (err) => {});
    Language.create({name: 'French'}, (err) => {});
    Language.create({name: 'Italian'}, (err) => {});

    Spec.create({name: 'Java'}, (err) => {});
    Spec.create({name: 'C++'}, (err) => {});
    Spec.create({name: 'animal law'}, (err) => {});
    Spec.create({name: 'Angular 2'}, (err) => {});

    Software.create({name: 'Microsoft World'}, (err) => {});
    Software.create({name: 'Photoshop'}, (err) => {});
    Software.create({name: 'Eclipse'}, (err) => {});
    Software.create({name: 'Web Storm'}, (err) => {});

    Certification.create({name: 'CISCO1'}, (err) => {});
    Certification.create({name: 'CISCO2'}, (err) => {});
    Certification.create({name: 'GOOLE1'}, (err) => {});
    Certification.create({name: 'GOOGLE2'}, (err) => {});

    Category.create({name: 'Web developer'}, (err) => {});
    Category.create({name: 'Front-end developer'}, (err) => {});
    Category.create({name: 'Android developer'}, (err) => {});
    Category.create({name: 'Copywriter'}, (err) => {});
});

function tableContains(arr, value) {
    for(let val of arr) {
        if(val == value)
            return true;
    }
    return false;
}

gulp.task('lang', (done) => {
    database.open(() => {});


    Employee.findOne({user_id: '5a9db34632ef8a0949684c00'}, (err, data) => {
        Language.findOne({name: 'French'}, (err, lang) => {
            lang.users.push(data._id);
            data.languages.push(lang._id);

            lang.save((err) => {});
            data.save((err) => {});
        });
    });
});

gulp.task('promise', (done) => {
    let promise = new Promise((resolve, reject) => {
       resolve('ooops');
    });
    promise
        .then((data) => {
            return new Promise((resolve, reject) => {
                resolve(data + ' HEY');
            });
        }).then(dat => {
            console.log(dat);
    });
});


gulp.task('employer', (done) => {
    database.open(() => {});

    Employer.findOne({user_id: '5aa2e70a8c226d2f027d2bb7'}, (err, body) => {
        if(err)
            console.log('BBB');
        console.log(body);
    });
});

gulp.task('findT', (done) => {
    database.open(() => {});

    Employee.find((err, data) => {
        console.log(data[data.length - 1]);
        console.log(data instanceof Array);
        data.forEach(o => {
            console.log("RAZ");
            if(o._id.equals(data[data.length - 1]._id))
                console.log("dziala");
        })
    });
});

gulp.task('fore', (done) => {

    let someArr = null;

    let promise = new Promise((resolve, reject) => {
        if(someArr == null)
            reject('NIPE');
        resolve('Dziala');
    })
        .then((data) => console.log(data))
        .catch((err) => console.log(err));
});

gulp.task('each', (done) => {
    let arr = new Map();
    arr.set('oh', 'my');
    arr.set('god', 'what');
    arr.set('have', 'you done');

    for(let [key, val] of arr) {
        console.log('KEY ' + key);
        console.log('VAL ' + val);
    }

    let lang = {language: ['ANG']};
    for(let l of lang.language) {
        console.log(l);
    }
});

gulp.task('param', (done) => {

    let prop = 'po';

    let arr = {prop: 'some'}

    console.log(arr);
});

gulp.task('find', (done) => {
    database.open(() => {});

    Category.findOne({name: {$regex: 'web developer', $options: 'i'}}, (err, data) => {
        console.log(data);
    });
});

gulp.task('many', (done) => {
    database.open(() => {});

    Bid.find({ask: '5aa6e7018666aa4a2ae0baf2'}, (err, data) => {
        console.log(data);
        data.forEach(object => {
            object.remove((err) => {if(err) console.log(err)});
        })
    })

});

gulp.task('date', (done) => {

    let messages =
    [
        {
            date: new Date(1521057765 * 1000),
            text: 'Four'
        },
        {
            date: new Date(1521055765 * 1000),
            text: 'Two'
        },
        {
            date: new Date(1521056765 * 1000),
            text: 'Tree'
        },
        {
            date: new Date(1521054765 * 1000),
            text: 'One'
        }

    ];
    console.log(`${new Date(1521054765 * 1000)}`);

    messages.forEach(el => {
        console.log(el.text + " date " + el.date);
    });

    messages.sort((el1, el2) => {
        return el1.date - el2.date;
    });

    messages.forEach(el => {
        console.log(el.text + " date " + el.date);
    });

    messages.sort((el1, el2) => {
        if(el1.date < el2.date)
            return -1;
        else
            return 1;
    });

    messages.forEach(el => {
        console.log(el.text + " date " + el.date + " secs " + el.date.getSeconds());
    });
});

gulp.task('dat', (done) => {
    database.open(() => {});


    // Message.count((err, data) => {
    //     console.log(data);
    // })
    //Message.create({content: 'Co tam?', from: '5aa6e6c88666aa4a2ae0baef', to: '5aa6e8a44048684a68cf346c'}, (err) => {});
    let userId = '5aa6e6c88666aa4a2ae0baef';
    //
    Message.aggregate()
        .match({from: {$ne: new mongoose.Types.ObjectId(userId)}})
        .sort({send_date: 1})
        .group({
            _id: "$from",
            text: {$last: "$content"},
            date: {$last: "$send_date"}
        })
        .exec((err, data) => {
            Message.aggregate()
                .match({from: new mongoose.Types.ObjectId(userId)})
                .sort({send_date: 1})
                .group({
                    _id: "$to",
                    text: {$last: "$content"},
                    date: {$last: "$send_date"}
                })
                .exec((err2, data2) => {

                    let ret = data2.concat(data);

                    ret.sort((el1, el2) => {
                        el1.date = el2.date;
                    })

                })
        });

    // Message.find({ $or: [{from: userId}, {to: userId}]})
    //     .sort([['send_date', -1]])
    //     .exec((err, data) => {
    //         console.log(data);
    //     });
});

gulp.task('in', (done) => {
    database.open(() => {});

    let emplQ = Employee.find();
       // .where('software').all(['5aa6e44c3ec2b549cb0f0d60']);

    emplQ
        .where('languages').all([ '5aa6e44c3ec2b549cb0f0d56']);

    emplQ
        .where('software').all(['5aa6e44c3ec2b549cb0f0d60']);

    let emC = emplQ;
    emC.count();

    emplQ
        .exec((err, data) => {
            console.log(data);

            emC.exec((err, d) => {
                console.log(d);
            });
        });
})