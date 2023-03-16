const express = require("express");
const router = express.Router();
const uuid = require("uuid");
// const uuid4 = uuid.v1();

// Load Validations
const validateBoardInput = require("../validation/board");
const validateEditBoardInput = require("../validation/editBoard");
const validateNewPanelInput = require("../validation/newPanel");
const validateNewItemInput = require("../validation/newItem");

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
  // console.log(req.body);
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
      const boardIDuuid = uuid.v1().toString();
      const panelIDuuid = uuid.v1().toString();
      Board.findOne({ boardID: uuid.toString() }).then((board) => {
        if (board) {
          errors.boardID = "Board ID already exists";
          return res.status(400).json(errors);
        } else {
          //Create Board
          const newBoard = new Board({
            boardLabel: req.body.boardLabel,
            boardID: boardIDuuid,
            dateModified: Date.now(),
            panels: {
              [panelIDuuid]: {
                name: "Requested",
                dateAdded: Date.now(),
                dateModified: Date.now(),
                items: [
                  {
                    id: uuid.v1(),
                    content: "First task",
                    dateAdded: Date.now(),
                    dateModified: Date.now(),
                  },
                  {
                    id: uuid.v1(),
                    content: "Second task",
                    dateAdded: Date.now(),
                    dateModified: Date.now(),
                  },
                  {
                    id: uuid.v1(),
                    content: "Third task",
                    dateAdded: Date.now(),
                    dateModified: Date.now(),
                  },
                  {
                    id: uuid.v1(),
                    content: "Fourth task",
                    dateAdded: Date.now(),
                    dateModified: Date.now(),
                  },
                  {
                    id: uuid.v1(),
                    content: "Fifth task",
                    dateAdded: Date.now(),
                    dateModified: Date.now(),
                  },
                ],
              },
            },
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

// @route   POST edc/boards/deleteBoard
// @desc    Delete Board
// @access  Private
router.post("/deleteBoard", (req, res) => {
  Board.findOneAndRemove({ boardID: req.body.boardID }).then(() =>
    res.json({ success: true })
  );
});

//PANEL APIS

// @route   POST edc/boards/addPanel
// @desc    Add new panel to board
// @access  Private
router.post("/addPanel", (req, res) => {
  const { errors, isValid } = validateNewPanelInput(req.body);
  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }
  //Get Fields
  const panelIDuuid = uuid.v1().toString();

  const boardFields = {};
  boardFields.boardID = req.body.boardID;
  if (req.body.boardLabel) boardFields.boardLabel = req.body.boardLabel;
  Board.findOne({ boardID: req.body.boardID })
    .then((board) => {
      boardFields.panels = {
        ...board.panels,
        [panelIDuuid]: {
          name: req.body.name,
          dateAdded: Date.now(),
          dateModified: Date.now(),
          items: [],
        },
      };
      console.log(boardFields.panels);
      if (board) {
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
    })
    .catch((err) =>
      res.status(404).json({
        boardID: "No board for this ID",
      })
    );
});

// @route   POST edc/boards/addItem
// @desc    Add new item to panel
// @access  Private
router.post("/addItem", (req, res) => {
  const { errors, isValid } = validateNewItemInput(req.body);

  // Check Validation
  if (!isValid) {
    // Return any errors with 400 status
    return res.status(400).json(errors);
  }
  //Get Fields
  const updatedPanel = {};
  boardFields.boardID = req.body.boardID;
  Board.findOne({ boardID: req.body.boardID })
    .then((board) => {
      Object.entries(board.panels).map((panel, index) => {
        if (panel[0] === req.body.panelID) {
          // console.log(panel[1].items);
        }
      });
      // boardFields.panels = {
      //   ...board.panels,
      //   [panelIDuuid]: {
      //     name: req.body.name,
      //     dateAdded: Date.now(),
      //     dateModified: Date.now(),
      //     items: [],
      //   },
      // };
      // console.log(boardFields.panels);
      // if (board) {
      //   //Update
      //   Board.findOneAndUpdate(
      //     { boardID: req.body.boardID },
      //     { $set: boardFields },
      //     { new: true }
      //   ).then((board) => res.json(board));
      // } else {
      //   errors.boardID = "No board for this ID";
      //   res.status(400).json(errors);
      // }
    })
    .catch((err) =>
      res.status(404).json({
        boardID: "No board for this ID",
      })
    );
});

module.exports = router;
