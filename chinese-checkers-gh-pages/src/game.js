angular.module('myApp').controller('Ctrl',
    ['$scope', '$document', '$log', '$timeout', 'gameLogic',
    function ($scope, $document, $log, $timeout, gameLogic) {

    'use strict';

    resizeGameAreaService.setWidthToHeight(1);
    $scope.selectedPosition = [];
    var boardEl = document.getElementById('board');

    $scope.map = [
		[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[3,13],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[4,13],[3.5,12],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[5,13],[4.5,12],[4,11],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[6,13],[5.5,12],[5,11],[4.5,10],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[9,17],[8.5,16],[8,15],[7.5,14],[7,13],[6.5,12],[6,11],[5.5,10],[5,9],[4.5,8],[4,7],[3.5,6],[3,5],[0,0]],
		[[0,0],[0,0],[9.5,16],[9,15],[8.5,14],[8,13],[7.5,12],[7,11],[6.5,10],[6,9],[5.5,8],[5,7],[4.5,6],[4,5],[0,0]],
		[[0,0],[0,0],[0,0],[10,15],[9.5,14],[9,13],[8.5,12],[8,11],[7.5,10],[7,9],[6.5,8],[6,7],[5.5,6],[5,5],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[10.5,14],[10,13],[9.5,12],[9,11],[8.5,10],[8,9],[7.5,8],[7,7],[6.5,6],[6,5],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[11,13],[10.5,12],[10,11],[9.5,10],[9,9],[8.5,8],[8,7],[7.5,6],[7,5],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[12,13],[11.5,12],[11,11],[10.5,10],[10,9],[9.5,8],[9,7],[8.5,6],[8,5],[7.5,4],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[13,13],[12.5,12],[12,11],[11.5,10],[11,9],[10.5,8],[10,7],[9.5,6],[9,5],[8.5,4],[8,3],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[14,13],[13.5,12],[13,11],[12.5,10],[12,9],[11.5,8],[11,7],[10.5,6],[10,5],[9.5,4],[9,3],[8.5,2],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[15,13],[14.5,12],[14,11],[13.5,10],[13,9],[12.5,8],[12,7],[11.5,6],[11,5],[10.5,4],[10,3],[9.5,2],[9,1],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[13.5,8],[13,7],[12.5,6],[12,5],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[14,7],[13.5,6],[13,5],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[14.5,6],[14,5],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[15,5],[0,0]],
		[[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]],
		];
	$scope.newposition = 50;
    $scope.newpositionTop = 50;
    $scope.setPagePosition = function(index, parentIndex) {
        $scope.newposition =  $scope.map[parentIndex][index][0]  * 6.7 - 13 + '%';
        return $scope.newposition;
    };
    $scope.setPagePositionTop = function(parentIndex, index){
        $scope.newpositionTop = $scope.map[parentIndex][index][1] * 5.7 - 4 + '%';
        return $scope.newpositionTop;
    };


    /**
     * Drag-and-drop
     * ---
     *
     */

    var cells = [],
        checkers = [];

    $scope.init = function() {
        cells = document.getElementsByClassName("checkerCell");
        checkers = document.getElementsByClassName("checker");
    };

    var dragEl = null,
        childEl, startEl,
        pos, startPos,
        row, col;

    var gameArea = angular.element(document.getElementById("gameArea"));

    function handleDrag(type, cx, cy) {
        var el = angular.element(document.elementFromPoint(cx, cy));
        if( !dragEl && el.hasClass('checker') ) {
            childEl = el;
            row = +el.attr('data-row');
            col = +el.attr('data-col');
            pos = childEl[0].getBoundingClientRect();
        }
        else if( el.hasClass('checkerCell') ) {
            childEl = el.children();
            row = +el.attr('data-row');
            col = +el.attr('data-col');
            pos = childEl[0].getBoundingClientRect();
        }

        if( type === "touchstart" && !dragEl && childEl ) {
            if(selectCell(row, col)) {
                startPos = pos;
                startEl = childEl;
                startEl.parent().addClass('selected');

                dragEl = angular.element('<div class="' + childEl.attr('class') + ' drag"></div>');

                dragEl.css('width', childEl[0].clientWidth + 'px');
                dragEl.css('height', childEl[0].clientHeight + 'px');
                dragEl.css('top', startPos.top + 'px');
                dragEl.css('left', startPos.left + 'px');
                dragEl.css('opacity', 1);
                dragEl.css('position', 'fixed');
                gameArea.append(dragEl);

                startEl.css('display', 'none');
            }
        }

        if (!dragEl) {
            return;
        }

        if (type === "touchend") {
            dragDone([row, col]);
        }
        else {
            var top = pos.top || startPos.top;
            var left = pos.left || startPos.left;

            dragEl.css('top', top + 'px');
            dragEl.css('left', left + 'px');
        }

        if (type === "touchend" || type === "touchcancel" || type === "touchleave") {
            /**
             * Drag ended.
             */
            dragEl.remove();
            startEl.parent().removeClass('selected');
            startEl.css('display', 'block');
            dragEl = null;
            childEl = null;
        }
    }
    dragAndDropService.addDragListener("gameArea", handleDrag);

    function dragDone(to) {
        selectCell(to[0], to[1]);
    }

    function updateUI(params) {
        $scope.params = params;
        $scope.board = params.stateAfterMove.board;

        var numPlayers = params.playersInfo.length;
        if( isEmpty(params.stateAfterMove) ) {
            try {
                gameLogic.setNumPlayers(numPlayers);
                $scope.board = gameLogic.getInitialBoard();

                boardEl.className = '';
                if(params.playMode === "playWhite") {
                    switch(numPlayers){
                        case 4:
                            boardEl.className = 'rot_60';
                    }
                }
                else if(params.playMode === "playBlack") {
                    switch(numPlayers){
                        case 2:
                            boardEl.className = 'rot_180';
                            break;
                        case 3:
                        case 4:
                            boardEl.className = 'rot_120';
                            break;
                        case 6:
                            boardEl.className = 'rot_60';
                    }
                }
            }
            catch(e) {
                return location.reload();
            }
        }


        $scope.validFromPositions = gameLogic.getValidFromPositions($scope.board, params.turnIndexAfterMove);

        $scope.isYourTurn = params.turnIndexAfterMove >= 0 && // game is ongoing
        params.yourPlayerIndex === params.turnIndexAfterMove; // it's my turn
        $scope.turnIndex = params.turnIndexAfterMove;

        if($scope.isYourTurn &&
           params.playersInfo[params.yourPlayerIndex].playerId === '') {
            $scope.isYourTurn = false; // to make sure the UI won't send another move.
            // Waiting 0.5 seconds to let the move animation finish; if we call aiService
            // then the animation is paused until the javascript finishes.
            $timeout(sendComputerMove, 500);
        }
    }

    function sendComputerMove() {
        var items = gameLogic.getPossibleMoves($scope.board, $scope.turnIndex);
        gameService.makeMove(items[Math.floor(Math.random()*items.length)]);
    }

    function selectCell(row, col) {
    	$log.info(["Clicked on cell: ",row,col,$scope.selectedPosition]);
    	if(!$scope.isYourTurn){
    		return false;
    	}

        if (window.location.search === '?throwException') {
            throw new Error("Throwing the error because URL has '?throwException'");
        }

        if( isSelectable(row, col) ) {
            $scope.selectedPosition = [row, col];
        }
        else if($scope.selectedPosition.length !== 0) {
        	try {
                var from = $scope.selectedPosition;
        		var move = gameLogic.createMove(from[0], from[1], row, col, $scope.turnIndex, $scope.board);
                $scope.selectedPosition = [];
        		$scope.isYourTurn = false;

        		gameService.makeMove(move);
        	} catch(e) {
        	 	$log.info(["Cell is already full in position:", row, col, e.stack]);
        	 	return false;
        	}
        }
        else {
            return false;
        }
        return true;
    }

    $scope.getCheckerClass = function(row, col) {
        var type = getCellType(row, col);
        if( type !== ' ' ) {
            return 'checker checker_' + getCellType(row, col);
        }
        return '';
    };

    function getCellType(row, col) {
        return  $scope.board[row][col];
    }

    var isSelectable = $scope.isSelectable = function(row, col) {
        for(var i = 0; i < $scope.validFromPositions.length; i++) {
            var pos = $scope.validFromPositions[i];
            if(row === pos.row && col === pos.col) {
                return true;
            }
        }
        return false;
    };

    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function isEmpty(obj) {
        if (obj === null) return true;
        if (obj.length > 0)    return false;
        if (obj.length === 0)  return true;
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    }


    gameService.setGame({
        gameDeveloperEmail: "jugalm9@gmail.com",
        minNumberOfPlayers: 2,
        maxNumberOfPlayers: 6,
        isMoveOk: gameLogic.isMoveOk,
        updateUI: updateUI
    });

}]);
