import { myCache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Product } from "../models/products-model.js";
import { User } from "../models/user-model.js";
import { Order } from "../models/order.model.js";
import { calculatePercentage, getInventories, getChartData, } from "../utils/features.js";
export const dashboardStats = TryCatch(async (req, res, next) => {
    let stats = {};
    if (myCache.has("admin-stats"))
        stats = JSON.parse(myCache.get("admin-stats"));
    else {
        const today = new Date();
        //getting  Six month ago from current Month
        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);
        // Getting current Month starting & ending dates
        const thisMonth = {
            start: new Date(today.getFullYear(), today.getMonth(), 1),
            end: today,
        };
        // Getting last Month starting & ending dates
        const lastMonth = {
            start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
            end: new Date(today.getFullYear(), today.getMonth(), 0),
        };
        // Getting All this month all Products
        const thisMonthProductsPromise = Product.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        // Getting all last month all product array
        const lastMonthProductsPromise = Product.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        // Getting this month  all User  array
        const thisMonthUserPromise = User.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        // Getting all last month all  User  array
        const lastMonthUserPromise = User.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        // Getting  this month all Order  array
        const thisMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end,
            },
        });
        // Getting all last month all  orders  array
        const lastMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end,
            },
        });
        const lastSixMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: sixMonthAgo,
                $lte: today,
            },
        });
        const latestTransactionsPromise = Order.find({})
            .select(["orderItems", "discount", "total", "status"])
            .limit(4);
        const [thisMonthProducts, //ARRay
        thisMonthOrders, //ARRay
        thisMonthUser, //ARRay
        lastMonthProducts, //ARRay
        lastMonthOrders, //ARRay
        lastMonthUser, //ARRay
        productsCount, //ARRay
        usersCount, //ARRay
        allOrders, //ARRay
        lastSixMonthOrders, categories, femaleUserCount, latestTransaction,] = await Promise.all([
            thisMonthProductsPromise,
            thisMonthOrdersPromise,
            thisMonthUserPromise,
            lastMonthProductsPromise,
            lastMonthOrdersPromise,
            lastMonthUserPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMonthOrdersPromise,
            Product.distinct("category"),
            User.countDocuments({ gender: "female" }),
            latestTransactionsPromise,
        ]);
        //Getting this month  total revenue
        const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        // Getting last Month revenue
        const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
        const ChangePercent = {
            revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
            percent: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
            user: calculatePercentage(thisMonthUser.length, lastMonthUser.length),
            order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
        };
        const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);
        const count = {
            revenue,
            product: productsCount,
            user: usersCount,
            order: allOrders.length,
        };
        const orderMonthcounts = new Array(6).fill(0);
        const orderMonthrevenue = new Array(6).fill(0);
        lastSixMonthOrders.forEach((order) => {
            const creationDate = order.createdAt;
            const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
            if (monthDiff < 6) {
                orderMonthcounts[6 - monthDiff - 1] += 1;
                orderMonthrevenue[6 - monthDiff - 1] += order.total;
            }
        });
        const categoryCount = await getInventories({
            categories,
            productsCount,
        });
        const userRatio = {
            male: usersCount - femaleUserCount,
            female: femaleUserCount,
        };
        const modifiedlatestTransaction = latestTransaction.map((i) => ({
            _id: i._id,
            discount: i.discount,
            amount: i.total,
            quantity: i.orderItems.length,
            status: i.status,
        }));
        stats = {
            categoryCount,
            ChangePercent,
            count,
            chart: {
                order: orderMonthcounts,
                revenue: orderMonthrevenue,
            },
            userRatio,
            latestTransaction: modifiedlatestTransaction,
        };
        myCache.set("admin-stats", JSON.stringify(stats));
    }
    return res.status(200).json({
        succcess: true,
        stats,
    });
});
export const getPieCharts = TryCatch(async (req, res, next) => {
    let charts;
    const key = "admin-pie-charts";
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const allOrderPromise = Order.find({}).select([
            "total",
            "discount",
            "subtotal",
            "tax",
            "shippingCharges",
        ]);
        const [processingOrder, shippedOrder, deliveredOrder, categories, productsCount, outOfStock, allOrders, allUsers, adminUsers, customerUsers,] = await Promise.all([
            Order.countDocuments({ status: "Processing" }),
            Order.countDocuments({ status: "Shipped" }),
            Order.countDocuments({ status: "Delivered" }),
            Product.distinct("category"),
            Product.countDocuments(),
            Product.countDocuments({ stock: 0 }),
            allOrderPromise,
            User.find({}).select(["dob"]),
            User.countDocuments({ role: "admin" }),
            User.countDocuments({ role: "user" }),
        ]);
        const orderFullfillment = {
            processing: processingOrder,
            shipped: shippedOrder,
            delivered: deliveredOrder,
        };
        const productCategories = await getInventories({
            categories,
            productsCount,
        });
        const stockAvailablity = {
            inStock: productsCount - outOfStock,
            outOfStock,
        };
        const grossIncome = allOrders.reduce((prev, order) => prev + (order.total || 0), 0);
        const discount = allOrders.reduce((prev, order) => prev + (order.discount || 0), 0);
        const productionCost = allOrders.reduce((prev, order) => prev + (order.ShippingCharges || 0), 0);
        const burnt = allOrders.reduce((prev, order) => prev + (order.tax || 0), 0);
        const marketingCost = Math.round(grossIncome * (30 / 100));
        const netMargin = grossIncome - discount - productionCost - burnt - marketingCost;
        const revenueDistribution = {
            netMargin,
            discount,
            productionCost,
            burnt,
            marketingCost,
        };
        const usersAgeGroup = {
            teen: allUsers.filter((i) => i.age < 20).length,
            adult: allUsers.filter((i) => i.age >= 20 && i.age < 40).length,
            old: allUsers.filter((i) => i.age >= 40).length,
        };
        const adminCustomer = {
            admin: adminUsers,
            customer: customerUsers,
        };
        charts = {
            orderFullfillment,
            productCategories,
            stockAvailablity,
            revenueDistribution,
            usersAgeGroup,
            adminCustomer,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});
export const getBarCharts = TryCatch(async (req, res, next) => {
    let charts;
    const key = "admin-bar-charts";
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const today = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const sixMonthProductPromise = Product.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const sixMonthUsersPromise = User.find({
            createdAt: {
                $gte: sixMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const twelveMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today,
            },
        }).select("createdAt");
        const [products, users, orders] = await Promise.all([
            sixMonthProductPromise,
            sixMonthUsersPromise,
            twelveMonthOrdersPromise,
        ]);
        const productCounts = getChartData({ length: 6, today, docArr: products });
        const usersCounts = getChartData({ length: 6, today, docArr: users });
        const ordersCounts = getChartData({ length: 12, today, docArr: orders });
        charts = {
            users: usersCounts,
            products: productCounts,
            orders: ordersCounts,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});
export const getLineCharts = TryCatch(async (req, res, next) => {
    let charts;
    const key = "admin-line-charts";
    if (myCache.has(key))
        charts = JSON.parse(myCache.get(key));
    else {
        const today = new Date();
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
        const baseQuery = {
            createdAt: {
                $gte: twelveMonthsAgo,
                $lte: today,
            },
        };
        const [products, users, orders] = await Promise.all([
            Product.find(baseQuery).select("createdAt"),
            User.find(baseQuery).select("createdAt"),
            Order.find(baseQuery).select(["createdAt", "discount", "total"]),
        ]);
        const productCounts = getChartData({ length: 12, today, docArr: products });
        const usersCounts = getChartData({ length: 12, today, docArr: users });
        const discount = getChartData({
            length: 12,
            today,
            docArr: orders,
            property: "discount",
        });
        const revenue = getChartData({
            length: 12,
            today,
            docArr: orders,
            property: "total",
        });
        charts = {
            users: usersCounts,
            products: productCounts,
            discount,
            revenue,
        };
        myCache.set(key, JSON.stringify(charts));
    }
    return res.status(200).json({
        success: true,
        charts,
    });
});
