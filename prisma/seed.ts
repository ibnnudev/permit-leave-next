import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const currentYear = new Date().getFullYear();

async function main() {
  console.log("🔄 Running seeder...");

  const password = await bcrypt.hash("password", 12);

  // 1. Institutions
  const institutions = await Promise.all([
    prisma.institution.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: "Nurul Ilmi Foundation",
        address: "123 Education Street, Jakarta",
        phone: "+628123456789",
      },
    }),
    prisma.institution.create({
      data: {
        name: "Al-Azhar School",
        address: "456 Knowledge Avenue, Bandung",
        phone: "+628987654321",
      },
    }),
    prisma.institution.create({
      data: {
        name: "Bina Bangsa Academy",
        address: "789 Wisdom Road, Surabaya",
        phone: "+628112233445",
      },
    }),
  ]);

  // 2. Employees (superadmin, admins, and regular employees)
  const employeeData = [
    // Super Admin
    {
      id: 1,
      institution_id: institutions[0].id,
      name: "Super Admin",
      gender: "Male",
      position: "Foundation Supervisor",
      whatsapp_number: "+628123456780",
      address: "123 Main Street",
      birth_place: "Bandung",
      birth_date: new Date("1980-01-01"),
      join_date: new Date("2020-01-01"),
      marital_status: "Married",
      employment_status: "Active",
      personal_email: "superadmin@personal.com",
      institution_email: "superadmin@foundation.com",
      religion: "Islam",
      last_education: "Master's Degree",
      password,
      role: Role.SUPERADMIN,
    },
    // Admin 1
    {
      id: 2,
      institution_id: institutions[0].id,
      name: "Education Admin",
      gender: "Female",
      position: "Education Manager",
      whatsapp_number: "+628123456781",
      address: "456 Education Lane",
      birth_place: "Jakarta",
      birth_date: new Date("1985-05-01"),
      join_date: new Date("2021-01-01"),
      marital_status: "Married",
      employment_status: "Active",
      personal_email: "admin1@personal.com",
      institution_email: "admin1@foundation.com",
      religion: "Islam",
      last_education: "Bachelor's Degree",
      password,
      role: Role.ADMIN,
    },
    // Admin 2
    {
      id: 3,
      institution_id: institutions[0].id,
      name: "HR Admin",
      gender: "Female",
      position: "HR Manager",
      whatsapp_number: "+628123456782",
      address: "789 HR Boulevard",
      birth_place: "Surabaya",
      birth_date: new Date("1988-07-15"),
      join_date: new Date("2021-06-01"),
      marital_status: "Single",
      employment_status: "Active",
      personal_email: "admin2@personal.com",
      institution_email: "admin2@foundation.com",
      religion: "Christian",
      last_education: "Bachelor's Degree",
      password,
      role: Role.ADMIN,
    },
    // Teacher 1
    {
      id: 4,
      institution_id: institutions[0].id,
      name: "John Doe",
      gender: "Male",
      position: "Senior Teacher",
      whatsapp_number: "+628123456783",
      address: "101 Teacher Street",
      birth_place: "Medan",
      birth_date: new Date("1990-03-03"),
      join_date: new Date("2022-01-01"),
      marital_status: "Single",
      employment_status: "Active",
      personal_email: "teacher1@personal.com",
      institution_email: "teacher1@foundation.com",
      religion: "Islam",
      last_education: "Bachelor's Degree",
      password,
      role: Role.EMPLOYEE,
    },
    // Teacher 2
    {
      id: 5,
      institution_id: institutions[0].id,
      name: "Jane Smith",
      gender: "Female",
      position: "Mathematics Teacher",
      whatsapp_number: "+628123456784",
      address: "202 Math Avenue",
      birth_place: "Yogyakarta",
      birth_date: new Date("1992-08-20"),
      join_date: new Date("2022-03-15"),
      marital_status: "Married",
      employment_status: "Active",
      personal_email: "teacher2@personal.com",
      institution_email: "teacher2@foundation.com",
      religion: "Catholic",
      last_education: "Master's Degree",
      password,
      role: Role.EMPLOYEE,
    },
    // Staff 1
    {
      id: 6,
      institution_id: institutions[0].id,
      name: "Robert Johnson",
      gender: "Male",
      position: "Administrative Staff",
      whatsapp_number: "+628123456785",
      address: "303 Office Road",
      birth_place: "Bali",
      birth_date: new Date("1987-11-11"),
      join_date: new Date("2021-09-01"),
      marital_status: "Married",
      employment_status: "Active",
      personal_email: "staff1@personal.com",
      institution_email: "staff1@foundation.com",
      religion: "Hindu",
      last_education: "Diploma",
      password,
      role: Role.EMPLOYEE,
    },
  ];

  // Add 20 more random employees for testing
  for (let i = 7; i <= 26; i++) {
    const gender = faker.person.sex();
    const firstName = faker.person.firstName(gender as any);
    const lastName = faker.person.lastName();
    const position = faker.helpers.arrayElement([
      "Teacher",
      "Senior Teacher",
      "Administrative Staff",
      "Librarian",
      "IT Support",
      "Counselor",
    ]);

    employeeData.push({
      id: i,
      institution_id: institutions[0].id,
      name: `${firstName} ${lastName}`,
      gender: gender === "male" ? "Male" : "Female",
      position,
      whatsapp_number: `+628${faker.string.numeric(9)}`,
      address: faker.location.streetAddress(),
      birth_place: faker.location.city(),
      birth_date: faker.date.birthdate({ min: 20, max: 60, mode: "age" }),
      join_date: faker.date.past({ years: 5 }),
      marital_status: faker.helpers.arrayElement([
        "Single",
        "Married",
        "Divorced",
      ]),
      employment_status: faker.helpers.arrayElement([
        "Active",
        "Probation",
        "Inactive",
      ]),
      personal_email: faker.internet.email({ firstName, lastName }),
      institution_email: faker.internet.email({
        firstName,
        lastName,
        provider: "foundation.com",
      }),
      religion: faker.helpers.arrayElement([
        "Islam",
        "Christian",
        "Catholic",
        "Hindu",
        "Buddhist",
      ]),
      last_education: faker.helpers.arrayElement([
        "High School",
        "Diploma",
        "Bachelor's Degree",
        "Master's Degree",
        "Doctorate",
      ]),
      password,
      role: Role.EMPLOYEE,
    });
  }

  await prisma.employee.createMany({
    data: employeeData,
    skipDuplicates: true,
  });

  // 3. Leave Types
  const leaveTypes = await prisma.leaveType.createMany({
    data: [
      {
        id: 1,
        name: "Sick Leave",
        description: "Leave when employee is sick",
        max_days: 2,
        require_document: true,
        hierarchical: true,
      },
      {
        id: 2,
        name: "Marriage Leave",
        description: "Leave for marriage",
        max_days: 7,
        require_document: false,
        hierarchical: true,
      },
      {
        id: 3,
        name: "Maternity Leave",
        description: "Leave for pregnancy and childbirth",
        max_days: 90,
        require_document: true,
        hierarchical: false,
      },
      {
        id: 4,
        name: "Annual Leave",
        description: "Regular annual leave",
        max_days: 12,
        require_document: false,
        hierarchical: true,
      },
      {
        id: 5,
        name: "Bereavement Leave",
        description: "Leave for family bereavement",
        max_days: 3,
        require_document: false,
        hierarchical: false,
      },
    ],
    skipDuplicates: true,
  });

  // 4. Leave Quotas for all employees
  const employees = await prisma.employee.findMany();
  const leaveQuotaData = [];

  for (const employee of employees) {
    for (const leaveType of await prisma.leaveType.findMany()) {
      // Skip maternity leave for male employees
      if (leaveType.id === 3 && employee.gender === "Male") continue;

      leaveQuotaData.push({
        employee_id: employee.id,
        leave_type_id: leaveType.id,
        year: currentYear,
        total_quota: leaveType.max_days,
        used_quota: 0,
      });
    }
  }

  await prisma.leaveQuota.createMany({
    data: leaveQuotaData,
    skipDuplicates: true,
  });

  // 5. Approval Flows
  const approvalFlows = await Promise.all([
    // Sick Leave (2 levels)
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 1,
        level: 1,
        created_by_id: 1,
      },
    }),
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 1,
        level: 2,
        created_by_id: 1,
      },
    }),
    // Marriage Leave (1 level)
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 2,
        level: 1,
        created_by_id: 1,
      },
    }),
    // Maternity Leave (no hierarchy)
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 3,
        level: 1,
        created_by_id: 1,
      },
    }),
    // Annual Leave (3 levels)
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 4,
        level: 1,
        created_by_id: 1,
      },
    }),
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 4,
        level: 2,
        created_by_id: 1,
      },
    }),
    prisma.approvalFlow.create({
      data: {
        institution_id: institutions[0].id,
        leave_type_id: 4,
        level: 3,
        created_by_id: 1,
      },
    }),
  ]);

  // 6. Approval Flow Employees (assign approvers)
  await prisma.approvalFlowEmployee.createMany({
    data: [
      // Level 1 approvers for Sick Leave (HR Admin and Education Admin)
      {
        approval_flow_id: approvalFlows[0].id,
        employee_id: 2, // Education Admin
      },
      {
        approval_flow_id: approvalFlows[0].id,
        employee_id: 3, // HR Admin
      },
      // Level 2 approver for Sick Leave (Super Admin)
      {
        approval_flow_id: approvalFlows[1].id,
        employee_id: 1, // Super Admin
      },
      // Marriage Leave approver (HR Admin)
      {
        approval_flow_id: approvalFlows[2].id,
        employee_id: 3, // HR Admin
      },
      // Maternity Leave approver (Super Admin)
      {
        approval_flow_id: approvalFlows[3].id,
        employee_id: 1, // Super Admin
      },
      // Annual Leave Level 1 (Department Head)
      {
        approval_flow_id: approvalFlows[4].id,
        employee_id: 2, // Education Admin as department head
      },
      // Annual Leave Level 2 (HR)
      {
        approval_flow_id: approvalFlows[5].id,
        employee_id: 3, // HR Admin
      },
      // Annual Leave Level 3 (Director)
      {
        approval_flow_id: approvalFlows[6].id,
        employee_id: 1, // Super Admin as director
      },
    ],
  });

  // 7. Create sample leaves for testing
  const leaveData = [];
  const statuses: ("PENDING" | "IN_PROCESS" | "APPROVED" | "REJECTED")[] = [
    "PENDING",
    "IN_PROCESS",
    "APPROVED",
    "REJECTED",
  ];

  // Create leaves for each employee (except super admin)
  for (const employee of employees.filter((e) => e.role !== "SUPERADMIN")) {
    const leaveTypes = await prisma.leaveType.findMany();

    for (const leaveType of leaveTypes) {
      // Skip maternity leave for male employees
      if (leaveType.id === 3 && employee.gender === "Male") continue;

      // Create 1-3 leaves of each type per employee
      const count = faker.number.int({ min: 1, max: 3 });

      for (let i = 0; i < count; i++) {
        const startDate = faker.date.soon({ days: 30 });
        const endDate = faker.date.soon({
          days: faker.number.int({ min: 1, max: leaveType.max_days }),
          refDate: startDate,
        });

        const status = faker.helpers.arrayElement(statuses);
        const level =
          status === "PENDING"
            ? 0
            : status === "IN_PROCESS"
            ? faker.number.int({ min: 1, max: 2 })
            : status === "APPROVED"
            ? 3
            : 0;

        leaveData.push({
          employee_id: employee.id,
          leave_type_id: leaveType.id,
          start_date: startDate,
          end_date: endDate,
          reason: faker.lorem.sentence(),
          status,
          last_processed_level: level,
          admin_notes: status === "REJECTED" ? faker.lorem.sentence() : null,
          recorded_by: faker.helpers.arrayElement([
            "System",
            "HR Admin",
            "Education Admin",
          ]),
          approved_by_id:
            status === "APPROVED"
              ? faker.helpers.arrayElement([1, 2, 3])
              : null,
          document: leaveType.require_document
            ? `https://example.com/documents/${faker.string.uuid()}.pdf`
            : null,
          created_at: faker.date.past({ years: 1 }),
          updated_at: faker.date.recent(),
        });
      }
    }
  }

  // Insert all leaves
  for (const leave of leaveData) {
    await prisma.leave.create({
      data: leave,
    });
  }

  // 8. Create approval logs for leaves
  const leaves = await prisma.leave.findMany();

  for (const leave of leaves) {
    if (leave.status === "PENDING") continue;

    const flow = await prisma.approvalFlow.findFirst({
      where: { leave_type_id: leave.leave_type_id, level: 1 },
    });

    if (!flow) continue;

    const approvers = await prisma.approvalFlowEmployee.findMany({
      where: { approval_flow_id: flow.id },
    });

    if (approvers.length === 0) continue;

    // Create log for level 1 approval
    await prisma.approvalLog.create({
      data: {
        leave_id: leave.id,
        employee_id: approvers[0].employee_id,
        level: 1,
        status:
          leave.status === "REJECTED"
            ? "REJECTED"
            : leave.last_processed_level > 1
            ? "APPROVED"
            : "PENDING",
        notes:
          leave.status === "REJECTED"
            ? leave.admin_notes
            : faker.lorem.sentence(),
        approval_date: leave.status === "REJECTED" ? faker.date.recent() : null,
        approval_deadline: faker.date.soon({ days: 3 }),
      },
    });

    // If there's a second level and leave wasn't rejected
    if (leave.last_processed_level > 1 && leave.status !== "REJECTED") {
      const flowLevel2 = await prisma.approvalFlow.findFirst({
        where: { leave_type_id: leave.leave_type_id, level: 2 },
      });

      if (flowLevel2) {
        const approversLevel2 = await prisma.approvalFlowEmployee.findMany({
          where: { approval_flow_id: flowLevel2.id },
        });

        if (approversLevel2.length > 0) {
          await prisma.approvalLog.create({
            data: {
              leave_id: leave.id,
              employee_id: approversLevel2[0].employee_id,
              level: 2,
              status: leave.status === "APPROVED" ? "APPROVED" : "PENDING",
              notes:
                leave.status === "APPROVED"
                  ? "Leave approved as per policy"
                  : null,
              approval_date:
                leave.status === "APPROVED" ? faker.date.recent() : null,
              approval_deadline: faker.date.soon({ days: 3 }),
            },
          });
        }
      }
    }
  }

  // 9. Notifications
  const notificationData = [];

  for (const employee of employees) {
    // 3-10 notifications per employee
    const count = faker.number.int({ min: 3, max: 10 });

    for (let i = 0; i < count; i++) {
      notificationData.push({
        employee_id: employee.id,
        message: faker.helpers.arrayElement([
          `Welcome to the leave management system, ${employee.name}!`,
          "Your leave request has been submitted",
          "Your leave request has been approved",
          "Your leave request requires additional information",
          "You have a new leave request to approve",
          "Reminder: Your leave request is pending approval",
          "Your leave balance has been updated",
          "Upcoming holiday schedule announced",
          "Important: Policy update regarding leave applications",
          `Happy birthday, ${employee.name}! Wishing you a wonderful day!`,
        ]),
        is_read: faker.datatype.boolean(),
        created_at: faker.date.past({ years: 1 }),
      });
    }
  }

  await prisma.notification.createMany({
    data: notificationData,
  });

  // 10. Update used quotas based on approved leaves
  const approvedLeaves = await prisma.leave.findMany({
    where: { status: "APPROVED" },
  });

  for (const leave of approvedLeaves) {
    const days =
      Math.ceil(
        (leave.end_date.getTime() - leave.start_date.getTime()) /
          (1000 * 60 * 60 * 24)
      ) + 1; // Inclusive of end date

    await prisma.leaveQuota.updateMany({
      where: {
        employee_id: leave.employee_id,
        leave_type_id: leave.leave_type_id,
        year: currentYear,
      },
      data: {
        used_quota: { increment: days },
      },
    });
  }

  console.log("✅ Seeder completed successfully!");
  console.log("\n📋 Login Accounts:");
  console.log("Superadmin: superadmin@foundation.com / password");
  console.log("Admin 1    : admin1@foundation.com / password");
  console.log("Admin 2    : admin2@foundation.com / password");
  console.log("Teacher 1  : teacher1@foundation.com / password");
  console.log("Teacher 2  : teacher2@foundation.com / password");
  console.log("Staff 1    : staff1@foundation.com / password");
  console.log("\n📊 Data Summary:");
  console.log(`- Institutions: ${institutions.length}`);
  console.log(`- Employees: ${employees.length}`);
  console.log(`- Leave Types: ${await prisma.leaveType.count()}`);
  console.log(`- Leave Quotas: ${await prisma.leaveQuota.count()}`);
  console.log(`- Approval Flows: ${approvalFlows.length}`);
  console.log(`- Leaves: ${leaves.length}`);
  console.log(`- Approval Logs: ${await prisma.approvalLog.count()}`);
  console.log(`- Notifications: ${notificationData.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
