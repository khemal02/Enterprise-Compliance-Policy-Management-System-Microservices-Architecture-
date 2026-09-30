import api from "../utils/axiosConfig";

export const getDashboardData = async () => {

    const [
        employees,
        policies,
        compliances,
        approvals,
        notifications,
        audits
    ] = await Promise.all([

        api.get("/employee"),
        api.get("/policy"),
        api.get("/compliance"),
        api.get("/approval"),
        api.get("/notification"),
        api.get("/audit")

    ]);

    return {

        employees: employees.data.length,
        policies: policies.data.length,
        compliances: compliances.data.length,
        approvals: approvals.data.length,
        notifications: notifications.data.length,
        audits: audits.data.length

    };

};