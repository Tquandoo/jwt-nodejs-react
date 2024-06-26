import db from "../models/index";

const createNewRoles = async (roles) => {
  try {
    let currentRoles = await db.Role.findAll({
      attributes: ["url", "description"],
      raw: true,
    });
    const persists = roles.filter(
      ({ url: url1 }) => !currentRoles.some(({ url: url2 }) => url2 === url1)
    );
    if (persists.length === 0) {
      return {
        EM: "Nothing to create...",
        EC: 0,
        DT: [],
      };
    }
    await db.Role.bulkCreate(roles);
    return {
      EM: `Create role succeeds: ${persists.length} roles  `,
      EC: 0,
      DT: [],
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with service",
      EC: 1,
      DT: [],
    };
  }
};

const getAllRoles = async () => {
  try {
    let data = await db.Role.findAll({
      order: [["id", "DESC"]],
    });
    return {
      EM: "Get all Roles succeeds...",
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with service",
      EC: 1,
      DT: [],
    };
  }
};

const getRoleWithPagination = async (page, limit) => {
  try {
    let offset = (page - 1) * limit;
    let { count, rows } = await db.Role.findAndCountAll({
      attributes: ["id", "url", "description"],
      offset: offset,
      limit: limit,
      order: [["id", "DESC"]],
    });
    let totalPages = Math.ceil(count / limit);
    let data = {
      totalRows: count,
      totalPages: totalPages,
      roles: rows,
    };
    return {
      EM: "fetch Oke La",
      EC: 0,
      DT: data,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with service",
      EC: 1,
      DT: [],
    };
  }
};
const deleteRole = async (id) => {
  try {
    let role = await db.Role.findOne({
      where: { id: id },
    });
    if (role) {
      await role.destroy();
    }
    return {
      EM: "Delete Roles succeeds...",
      EC: 0,
      DT: [],
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with service",
      EC: 1,
      DT: [],
    };
  }
};
const getRoleByGroup = async (id) => {
  try {
    if (!id) {
      return {
        EM: "Not found any roles",
        EC: 0,
        DT: [],
      };
    }

    let roles = await db.Group.findOne({
      where: { id: id },
      include: {
        model: db.Role,
        attributes: ["id", "url", "description"],
        through: { attributes: [] }, // để loại bỏ get thuộc tính mà 2 table map chung
      },
    });
    return {
      EM: "get roles by group succeeds...",
      EC: 0,
      DT: roles,
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with service",
      EC: 1,
      DT: [],
    };
  }
};
const assignRoleToGroup = async (data) => {
  try {
    // let data {groupId: 4, groupRoles: [{}, {}]}
    await db.Group_Role.destroy({
      where: { groupId: +data.groupId },
    });
    await db.Group_Role.bulkCreate(data.groupRoles);
    return {
      EM: "assign role to group succeeds..",
      EC: 0,
      DT: [],
    };
  } catch (e) {
    console.log(e);
    return {
      EM: "something wrongs with service",
      EC: 1,
      DT: [],
    };
  }
};
module.exports = {
  createNewRoles,
  getAllRoles,
  deleteRole,
  getRoleByGroup,
  assignRoleToGroup,
  getRoleWithPagination,
};
