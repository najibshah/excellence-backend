const express = require("express");
const router = express.Router();
const uuid = require("uuid");
const uuid4 = uuid.v4();

// Load Board Validation
const validateBoardInput = require("../validation/board");
const validateEditBoardInput = require("../validation/editBoard");

// Load Board model
const mongoose = require("mongoose");
require("../models/Board");
const Board = mongoose.model("Board");

// @route   GET edc/boards/test
// @desc    Tests Users Route
// @access  Public
router.get("/test", (req, res) =>
  res.json({
    msg: "Boards Route Works",
    routes: "edc/boards/allroutes     To see all available routes",
  })
);

// @route   GET edc/boards/allRoutes
// @desc    displays all available Routes
// @access  Public
router.get("/allroutes", (req, res) =>
  res.json({
    addBoard: "edc/boards/addBoard",
    getAll: "edc/boards/all",
  })
);

// @route   Post edc/boards/addBoard
// @desc    Add new board to project
// @access  Public
router.post("/addBoard", (req, res) => {
  const { errors, isValid } = validateBoardInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  //Check if board label already exists
  Board.findOne({ boardLabel: req.body.boardLabel }).then((board) => {
    if (board) {
      errors.boardLabel = "That Board Label already exists";
      res.status(400).json(errors);
    } else {
      //Check if board ID already
      Board.findOne({ boardID: uuid.toString() }).then((board) => {
        if (board) {
          errors.boardID = "Board ID already exists";
          return res.status(400).json(errors);
        } else {
          //Create Board
          const newBoard = new Board({
            boardLabel: req.body.boardLabel,
            boardID: uuid4.toString(),
            dateModified: Date.now(),
          });
          //Add Board to database
          newBoard
            .save()
            .then((board) => res.json(board))
            .catch((err) => console.log(err));
        }
      });
    }
  });
});

// @route   GET edc/boards/all
// @desc    Get all boards
// @access  Public
router.get("/all", (req, res) => {
  const errors = {};
  Board.find()
    .sort({ date: -1 })
    .then((boards) => res.json(boards))
    .catch((err) => res.status(404).json({ noboardsfound: "No boards found" }));
});

// @route   POST edc/boards/editBoard
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

// @route   DELETE edc/boards/deleteBoard
// @desc    Delete Board
// @access  Private
router.delete("/deleteBoard", (req, res) => {
  Board.findOneAndRemove({ boardID: req.body.boardID }).then(() =>
    res.json({ success: true })
  );
});

//TODO delete panels related to board

module.exports = router;
