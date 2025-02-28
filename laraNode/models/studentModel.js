// module.exports = (sequelize, DataTypes) => {
//     const Student = sequelize.define("Student", {
//         name: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         email: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true 
//         },
//         phoneNumber: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         password: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         imagePath: {
//             type: DataTypes.STRING, 
//             allowNull: true, 
//         },
//         role: {
//             type: DataTypes.ENUM('ADMIN','TRAINER','STUDENT', 'SUPER ADMIN','PLACEMENT OFFICER','RECRUITER'),
//             allowNull: false
//         },
//         college_id: {
//             type: DataTypes.INTEGER, 
//             allowNull: true
//         }
//     },
//     {
//         timestamps: false, // Disable createdAt and updatedAt
        
//     });
      
//     return Student;
// };



// ALTER TABLE laradb.students
// MODIFY COLUMN `role` ENUM('ADMIN', 'TRAINER', 'STUDENT', 'SUPER ADMIN', 'PLACEMENT OFFICER', 'RECRUITER') NOT NULL;



const moment = require("moment");

module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define("Student", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        uniqueStudentId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imagePath: {
            type: DataTypes.STRING,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM("ADMIN", "TRAINER", "STUDENT", "SUPER ADMIN", "PLACEMENT OFFICER", "RECRUITER"),
            allowNull: false
        },
        college_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        timestamps: false,
        hooks: {
            beforeValidate: (student) => {
                if (!student.uniqueStudentId) {
                    student.uniqueStudentId = "TEMP00"; // Temporary ID before DB insert
                }
            },
            beforeCreate: async (student) => {
                student.uniqueStudentId = await generateCustomId(sequelize);
            }
        }
    });

    return Student;
};

/**
 * Function to generate the unique ID in the format: {MONTH}{YY}{AUTO_INCREMENT}
 */
async function generateCustomId(sequelize) {
    const prefix = "TEMP"; // Temporary prefix for new records

    // Find the latest student with the TEMP prefix
    const lastStudent = await sequelize.models.Student.findOne({
        where: {
            uniqueStudentId: {
                [sequelize.Sequelize.Op.like]: `${prefix}%`
            }
        },
        order: [['uniqueStudentId', 'DESC']]
    });

    let newNumber = 1;

    if (lastStudent) {
        const lastId = lastStudent.uniqueStudentId;
        const lastNumber = parseInt(lastId.replace(prefix, "")); // Extract numeric part
        newNumber = lastNumber + 1;
    }

    // Maintain the same length format: 0001, 0002, ..., 9999
    const newNumberStr = String(newNumber).padStart(4, '0');

    return `${prefix}${newNumberStr}`;
}






// ALTER TABLE laradb.students
// ADD COLUMN `uniqueStudentId` VARCHAR(15) UNIQUE NULL;

// SET @month = DATE_FORMAT(NOW(), '%b');  -- e.g., "FEB"
// SET @year = RIGHT(YEAR(NOW()), 2);      -- e.g., "25"
// SET @counter = 0;                       -- Initialize counter

// -- Create a temporary table to store computed values
// CREATE TEMPORARY TABLE temp_student_ids AS
// SELECT id, 
//        (@counter := @counter + 1) AS num,
//        CONCAT(
//            UPPER(@month),       -- Current month abbreviation
//            @year,               -- Last two digits of the year
//            LPAD(@counter, 4, '0') -- Auto-increment (0001, 0002, ...)
//        ) AS newUniqueId
// FROM laradb.students
// ORDER BY id ASC;

// -- Update the students table using the temporary table
// UPDATE laradb.students s
// JOIN temp_student_ids t ON s.id = t.id
// SET s.uniqueStudentId = t.newUniqueId;

// -- Drop the temporary table after update
// DROP TEMPORARY TABLE temp_student_ids;

