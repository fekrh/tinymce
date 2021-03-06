/**
 * TableActions.js
 *
 * Released under LGPL License.
 * Copyright (c) 1999-2017 Ephox Corp. All rights reserved
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

define(
  'tinymce.plugins.table.actions.TableActions',
  [
    'ephox.katamari.api.Arr',
    'ephox.katamari.api.Fun',
    'ephox.katamari.api.Option',
    'ephox.snooker.api.CellMutations',
    'ephox.snooker.api.TableDirection',
    'ephox.snooker.api.TableFill',
    'ephox.snooker.api.TableOperations',
    'ephox.sugar.api.node.Element',
    'ephox.sugar.api.properties.Attr',
    'ephox.sugar.api.search.SelectorFilter',
    'tinymce.plugins.table.queries.Direction'
  ],
  function (Arr, Fun, Option, CellMutations, TableDirection, TableFill, TableOperations, Element, Attr, SelectorFilter, Direction) {
    return function (editor, lazyWire) {
      var fireNewRow = function (node) {
        editor.fire('newrow', {
          node: node.dom()
        });
        return node.dom();
      };

      var fireNewCell = function (node) {
        editor.fire('newcell', {
          node: node.dom()
        });
        return node.dom();
      };

      var cloneFormatsArray;
      if (editor.settings.table_clone_elements !== false) {
        if (typeof editor.settings.table_clone_elements == 'string') {
          cloneFormatsArray = editor.settings.table_clone_elements.split(/[ ,]/);
        } else if (Array.isArray(editor.settings.table_clone_elements)) {
          cloneFormatsArray = editor.settings.table_clone_elements;
        }
      }
      // Option.none gives the default cloneFormats.
      var cloneFormats = Option.from(cloneFormatsArray);

      var execute = function (operation, mutate, lazyWire) {
        return function (table, target) {
          var dataStyleCells = SelectorFilter.descendants(table, 'td[data-mce-style],th[data-mce-style]');
          Arr.each(dataStyleCells, function (cell) {
            Attr.remove(cell, 'data-mce-style');
          });
          var wire = lazyWire();
          var doc = Element.fromDom(editor.getDoc());
          var direction = TableDirection(Direction.directionAt);
          var generators = TableFill.cellOperations(mutate, doc, cloneFormats);
          return operation(wire, table, target, generators, direction).bind(function (result) {
            Arr.each(result.newRows(), function (row) {
              fireNewRow(row);
            });
            Arr.each(result.newCells(), function (cell) {
              fireNewCell(cell);
            });
            return result.cursor().map(function (cell) {
              var rng = editor.dom.createRng();
              rng.setStart(cell.dom(), 0);
              rng.setEnd(cell.dom(), 0);
              return rng;
            });
          });
        };
      };

      var deleteRow = execute(TableOperations.eraseRows, Fun.noop, lazyWire);

      var deleteColumn = execute(TableOperations.eraseColumns, Fun.noop, lazyWire);

      var insertRowsBefore = execute(TableOperations.insertRowsBefore, Fun.noop, lazyWire);

      var insertRowsAfter = execute(TableOperations.insertRowsAfter, Fun.noop, lazyWire);

      var insertColumnsBefore = execute(TableOperations.insertColumnsBefore, CellMutations.halve, lazyWire);

      var insertColumnsAfter = execute(TableOperations.insertColumnsAfter, CellMutations.halve, lazyWire);

      var mergeCells = execute(TableOperations.mergeCells, Fun.noop, lazyWire);

      var unmergeCells = execute(TableOperations.unmergeCells, Fun.noop, lazyWire);

      var pasteRowsBefore = execute(TableOperations.pasteRowsBefore, Fun.noop, lazyWire);

      var pasteRowsAfter = execute(TableOperations.pasteRowsAfter, Fun.noop, lazyWire);

      var pasteCells = execute(TableOperations.pasteCells, Fun.noop, lazyWire);

      return {
        deleteRow: deleteRow,
        deleteColumn: deleteColumn,
        insertRowsBefore: insertRowsBefore,
        insertRowsAfter: insertRowsAfter,
        insertColumnsBefore: insertColumnsBefore,
        insertColumnsAfter: insertColumnsAfter,
        mergeCells: mergeCells,
        unmergeCells: unmergeCells,
        pasteRowsBefore: pasteRowsBefore,
        pasteRowsAfter: pasteRowsAfter,
        pasteCells: pasteCells
      };
    };
  }
);
