const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

router.get("/", (req, res) => {
    res.send("We are one Post");
});

router.post("/", async (req, res) => {
    try {
        const mainAcountNumber = req.body.mainAcountNumber;
        const firstChildAcountNumber = req.body.firstChildAcountNumber;
        const secondChildAcountNumber = req.body.secondChildAcountNumber;
        const debt = req.body.debt;

        let mainAcount = await Post.findOne({ acountNumber: Math.floor(parseFloat(mainAcountNumber)) });

        if (!mainAcount) {
            mainAcount = new Post({
                acountNumber: Math.floor(parseFloat(mainAcountNumber)),
                debt: 0,
                childAcount: [],
            });
        }
        
        const hasExistingSecondChild = mainAcount.childAcount.some(
            (child) => child.secondChild.some(
                (secondChild) => secondChild.secondChildAcountNumber === mainAcountNumber + '.' + firstChildAcountNumber + '.' + secondChildAcountNumber
            )
        );

        if (hasExistingSecondChild) {
            return res.status(400).json({ error: "Second child with the same account number already exists." });
        }

        let firstChildAcount = mainAcount.childAcount.find(
            (child) => child.firstChildAcountNumber === mainAcountNumber + '.' + firstChildAcountNumber
        );

        if (!firstChildAcount) {
            firstChildAcount = {
                firstChildAcountNumber: mainAcountNumber + '.' + firstChildAcountNumber,
                firstChildDebpt: debt,
                secondChild: [{
                    secondChildAcountNumber: mainAcountNumber + '.' + firstChildAcountNumber + '.' + secondChildAcountNumber,
                    secondChildDebpt: debt
                }],
            };

            mainAcount.childAcount.push(firstChildAcount);
        }

        const existingSecondChild = {
            secondChildAcountNumber: mainAcountNumber + '.' + firstChildAcountNumber + '.' + secondChildAcountNumber,
            secondChildDebpt: debt,
        };

        firstChildAcount.secondChild.push(existingSecondChild);

        mainAcount.debt += debt;
        firstChildAcount.firstChildDebpt += debt;

        await mainAcount.save();

        res.json(mainAcount);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
