//1. Find all the topics and tasks taught in the month of October:
db.topics.find({ date_taught: { $gte: ISODate("2020-10-01"), $lte: ISODate("2020-10-31") } })
db.tasks.find({ date_assigned: { $gte: ISODate("2020-10-01"), $lte: ISODate("2020-10-31") } })
//2. Find all the company drives that appeared between 15 Oct 2020 and 31 Oct 2020:
db.company_drives.find({ drive_date: { $gte: ISODate("2020-10-15"), $lte: ISODate("2020-10-31") } })
//3. Find all the company drives and students who appeared for the placement:
db.company_drives.find({ "participants.status": "appeared" })
//4. Find the number of problems solved by the user in CodeKata:
var userProblems = db.users.findOne({ name: "John Doe" }); 
var problemsSolved = db.codekata.find({ user_id: userProblems._id }).count();
//5. Find all mentors with more than 15 mentees:
db.mentors.find({ mentees: { $size: { $gt: 15 } } })
//6. Find the number of users who are absent and tasks are not submitted between 15 Oct 2020 and 31 Oct 2020:
db.users.aggregate([
    {
      $lookup: {
        from: "attendance",
        localField: "_id",
        foreignField: "user_id",
        as: "attendance"
      }
    },
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "user_id",
        as: "tasks"
      }
    },
    {
      $match: {
        $and: [
          { "attendance.session_date": { $gte: ISODate("2020-10-15"), $lte: ISODate("2020-10-31") } },
          { "attendance.status": "absent" },
          { "tasks.date_assigned": { $gte: ISODate("2020-10-15"), $lte: ISODate("2020-10-31") } }
        ]
      }
    },
    {
      $group: {
        _id: null,
        count: { $sum: 1 }
      }
    }
  ])
  