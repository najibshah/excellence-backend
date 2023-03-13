const express = require("express");
const router = express.Router();
const uuid = require("uuid");
// const uuid4 = uuid.v4();

// Load Board Validation
const validatePanelInput = require("../validation/panel");

// Load Board model
const mongoose = require("mongoose");
require("../models/Panel");
const Panel = mongoose.model("Panel");

// @route   GET edc/panels/test
// @desc    Tests Panels Route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "panels Route Works",
    routes: "edc/panels/allroutes     To see all available routes",
  })
);

// @route   GET edc/panels/allRoutes
// @desc    displays all available Routes
// @access  Public
router.get("/allroutes", (req, res) =>
  res.json({
    addPanel: "edc/panels/addBoard",
    getAll: "edc/panels/all",
    editPanel: "edc/panels/edit",
    deletePanel: "edc/panels/delete",
  })
);

// @route   Post edc/panels/addBoard
// @desc    Add new board to project
// @access  Public
router.post("/addPanel", (req, res) => {
  // console.log(req.body);
  const { errors, isValid } = validatePanelInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  //Check if panel  exists
  Panel.findOne({
    boardID: req.body.boardID,
    panelLabel: req.body.panelLabel,
  }).then((panel) => {
    if (panel) {
      errors.panelLabel = "That Panel Label already exists";
      res.status(400).json(errors);
    } else {
      //Create Panel
      const newPanel = new Panel({
        panelLabel: req.body.panelLabel,
        panelID: uuid.v4().toString(),
        boardID: req.body.boardID,
        dateModified: Date.now(),
      });
      //Add Board to database
      newPanel
        .save()
        .then((panel) => res.json(panel))
        .catch((err) => console.log(err));
      // }
      // });
    }
  });
});

// @route   GET edc/panels/all
// @desc    Get all panels
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};
  Panel.find()
    .sort({ date: -1 })
    .then((panels) => res.json(panels))
    .catch((err) => res.status(404).json({ nopanelsfound: "No panels found" }));
});

// @route   POST edc/panels/editBoard
// @desc    Edit board label
// @access  Private
router.post("/editBoard", (req, res) => {
  const { errors, isValid } = validateEditBoardInput(req.body);
  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }
  //Get Fields
  const boardFields = {};
  boardFields.boardID = req.body.boardID;
  if (req.body.boardLabel) boardFields.boardLabel = req.body.boardLabel;
  Board.findOne({ boardID: req.body.boardID })
    .then((board) => {
      if (board.boardLabel === req.body.boardLabel) {
        errors.boardLabel = "That Board Label already exists";
        res.status(400).json(errors);
      } else {
        if (board) {
          console.log(board);
          //Update
          Board.findOneAndUpdate(
            { boardID: req.body.boardID },
            { $set: boardFields },
            { new: true }
          ).then((board) => res.json(board));
        } else {
          errors.boardID = "No board for this ID";
          res.status(400).json(errors);
        }
      }
    })
    .catch((err) =>
      res.status(404).json({
        boardID: "No board for this ID",
      })
    );
});

// @route   DELETE edc/panels/deleteBoard
// @desc    Delete Board
// @access  Private
router.delete("/deleteBoard", (req, res) => {
  Board.findOneAndRemove({ boardID: req.body.boardID }).then(() =>
    res.json({ success: true })
  );
});

//TODO delete panels related to board

module.exports = router;
