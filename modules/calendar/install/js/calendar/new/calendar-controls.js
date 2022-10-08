;(function(window) {
	function SelectInput(params)
	{
		this.id = params.id || 'bx-select-input-' + Math.round(Math.random() * 1000000);
		this.values = params.values || false;
		this.input = params.input;
		this.defaultValue = params.defaultValue || '';
		this.openTitle = params.openTitle || '';
		this.className = params.className || '';
		this.currentValue = params.value;
		this.currentValueIndex = params.valueIndex;
		this.onChangeCallback = params.onChangeCallback || null;
		this.zIndex = params.zIndex || 1200;
		this.disabled = params.disabled;
		if (this.onChangeCallback)
		{
			BX.bind(this.input, 'change', this.onChangeCallback);
			BX.bind(this.input, 'keyup', this.onChangeCallback);
		}

		if (this.currentValueIndex !== undefined && this.values[this.currentValueIndex])
		{
			this.input.value = this.values[this.currentValueIndex].label;
		}

		this.curInd = false;

		if (this.values)
		{
			BX.bind(this.input, 'click', BX.proxy(this.onClick, this));
			BX.bind(this.input, 'focus', BX.proxy(this.onFocus, this));
			BX.bind(this.input, 'blur', BX.proxy(this.onBlur, this));
			BX.bind(this.input, 'keyup', BX.proxy(this.onKeyup, this));
		}
	}

	SelectInput.prototype = {
		showPopup: function()
		{
			if (this.shown || this.disabled)
				return;

			var
				ind = 0,
				j = 0,
				menuItems = [],
				i, _this = this;

			for (i = 0; i < this.values.length; i++)
			{
				if (this.values[i].delimiter)
				{
					menuItems.push(this.values[i]);
				}
				else
				{
					if (this.currentValue && this.values[i] && this.values[i].value == this.currentValue.value)
					{
						ind = j;
					}

					menuItems.push({
						id: this.values[i].value,
						text: this.values[i].label,
						onclick: this.values[i].callback || (function (value, label)
						{
							return function ()
							{
								_this.input.value = label;
								_this.popupMenu.close();
								_this.onChange();
							}
						})(this.values[i].value, this.values[i].labelRaw || this.values[i].label)
					});
					j++;
				}
			}

			this.popupMenu = BX.PopupMenu.create(
				this.id,
				this.input,
				menuItems,
				{
					closeByEsc : true,
					autoHide : true,
					zIndex: this.zIndex,
					offsetTop: 0,
					offsetLeft: 0
				}
			);
			this.popupMenu.popupWindow.setWidth(this.input.offsetWidth - 2);

			var menuContainer = this.popupMenu.layout.menuContainer;
			BX.addClass(this.popupMenu.layout.menuContainer, 'calendar-select-popup');
			this.popupMenu.show();

			var menuItem = this.popupMenu.menuItems[ind];
			if (menuItem && menuItem.layout)
			{
				menuContainer.scrollTop = menuItem.layout.item.offsetTop - menuItem.layout.item.offsetHeight;
			}

			BX.addCustomEvent(this.popupMenu.popupWindow, 'onPopupClose', function()
			{
				BX.PopupMenu.destroy(_this.id);
				_this.shown = false;
				_this.popupMenu = null;
			});

			this.input.select();

			this.shown = true;
		},

		closePopup: function()
		{
			BX.PopupMenu.destroy(this.id);
			this.popupMenu = null;
			this.shown = false;
		},

		onFocus: function()
		{
			setTimeout(BX.delegate(function(){
				if (!this.shown)
				{
					this.showPopup();
				}
			}, this), 200);
		},

		onClick: function()
		{
			if (this.shown)
			{
				this.closePopup();
			}
			else
			{
				this.showPopup();
			}
		},

		onBlur: function()
		{
			setTimeout(BX.delegate(this.closePopup, this), 200);
		},

		onKeyup: function()
		{
			setTimeout(BX.delegate(this.closePopup, this), 50);
		},

		onChange: function()
		{
			var val = this.input.value;
			BX.onCustomEvent(this, 'onSelectInputChanged', [this, val]);
			if (BX.type.isFunction(this.onChangeCallback))
			{
				this.onChangeCallback({value: val});
			}
		},

		destroy: function()
		{
			if (this.onChangeCallback)
			{
				BX.unbind(this.input, 'change', this.onChangeCallback);
				BX.unbind(this.input, 'keyup', this.onChangeCallback);
			}

			BX.unbind(this.input, 'click', BX.proxy(this.onClick, this));
			BX.unbind(this.input, 'focus', BX.proxy(this.onFocus, this));
			BX.unbind(this.input, 'blur', BX.proxy(this.onBlur, this));
			BX.unbind(this.input, 'keyup', BX.proxy(this.onKeyup, this));

			if (this.popupMenu)
				this.popupMenu.close();
			BX.PopupMenu.destroy(this.id);
			this.popupMenu = null;
			this.shown = false;
		}
	};

	function NavigationCalendar(calendar, params)
	{
		this.calendar = calendar;
		this.outerWrap = params.wrap;
		this.created = false;
	}

	NavigationCalendar.prototype = {
		show: function ()
		{
			if (!this.created)
			{
				this.smallCalendar = new BX.JCCalendar();
				this.smallCalendar.month_popup_classname = 'calendar-navi-month-popup';
				this.smallCalendar.year_popup_classname = 'calendar-navi-year-popup';

				this.smallCalendar.Show({
					node: this.outerWrap,
					callback_after: BX.proxy(this.changeDate, this),
					bTime: false
				});

				this.outerWrap.appendChild(this.smallCalendar.DIV);
				this.smallCalendar.popup.close();
				this.created = true;
				this.paintTodayElement();
				BX.addCustomEvent(this.calendar, 'changeViewRange', BX.proxy(this.setDate, this));
			}
			this.outerWrap.style.display = '';
		},

		hide: function ()
		{
			this.outerWrap.style.display = 'none';
		},

		changeDate: function(date)
		{
			if (date && this.calendar.getView())
			{
				this.calendar.getView().adjustViewRangeToDate(date);
			}
		},

		paintTodayElement: function()
		{
			var todayDate = new Date();
			todayDate.setHours(0, 0, 0, 0);
			var timezoneOffset = parseInt(todayDate.getTimezoneOffset());
			var timestamp = todayDate.getTime();
			if (timezoneOffset !== 0)
			{
				timestamp -= ((timezoneOffset * 60) * 1000);
			}

			var todayElement = document.querySelector('[data-date="' + timestamp + '"]');
			if (BX.Type.isDomNode(todayElement))
			{
				BX.Dom.addClass(todayElement, 'bx-calendar-today-date');
			}
		},

		setDate: function(date)
		{
			if(date && this.smallCalendar.value
				&& this.calendar.util.getDayCode(this.smallCalendar.value) != this.calendar.util.getDayCode(date))
			{
				date.setHours(12, 0);
				this.smallCalendar.SetValue(date);
			}
		}
	};

	function DragDrop(calendar)
	{
		this.calendar = calendar;

		this.undoList = [];
		this.redoList = [];
		this.eventDragAndDrop = new BX.Calendar.Ui.Tools.EventDragAndDrop(
			this.getDateByPos.bind(this),
			this.getPosByDate.bind(this),
			this.getEvents.bind(this)
		);
		this.resizeDragAndDrop = new BX.Calendar.Ui.Tools.ResizeDragAndDrop(
			this.getDateByPos.bind(this),
			this.getPosByDate.bind(this),
		);
	}

	DragDrop.prototype = {

		getPosByDate(date)
		{
			const time = {
				h: date.getHours(),
				m: date.getMinutes()
			};
			return this.offset + this.calendar.getView().getPosByTime(time);
		},

		getDateByPos(pos)
		{
			const time = this.calendar.getView().getTimeByPos(pos - this.offset, 5);
			const date = new Date(this.currentState.entry.from.getTime());
			date.setHours(time.h, time.m, 0, 0);
			return date;
		},

		getEvents()
		{
			return this.calendar.getView().getEvents(this.currentState.day);
		},

		undo()
		{
			this.manageHistory(this.undoList, this.redoList);
		},

		redo()
		{
			this.manageHistory(this.redoList, this.undoList);
		},

		manageHistory(source, destination)
		{
			if (source.length === 0)
			{
				return;
			}
			destination.push(this.getEntryState(this.currentState.entry));
			this.currentState.entry = source.pop();
			this.saveEntry({
				from: this.currentState.entry.from,
				to: this.currentState.entry.to
			});
		},

		getEntryState: function(entry)
		{
			const entryState = {
				uid: entry.uid,
				from: new Date(entry.from.getTime()),
				to: new Date(entry.to.getTime()),
				data: {
					DT_LENGTH: entry.data.DT_LENGTH,
				},
				startDayCode: new Date(entry.from.getTime()),
				endDayCode: new Date(entry.to.getTime()),
			};
			if (entry.id !== entry.uid)
			{
				const id = entry.uid.split("|")[0];
				const date = entry.uid.split("|")[1];
				entryState.data.RELATIONS = {
					COMMENT_XML_ID: 'EVENT_' + id + '_' + date
				};
			}
			return entryState;
		},

		reset: function()
		{
			jsDD.Reset();
		},

		registerDay: function(day)
		{
			const dayNode = day.node;
			const date = day.date;
			jsDD.registerDest(dayNode);

			dayNode.onbxdestdragfinish = () =>
			{
				BX.removeClass(dayNode, 'calendar-grid-drag-select');
			};
			dayNode.onbxdestdraghover = () => {
				if (!this.currentState || !this.draggedNode)
				{
					return;
				}
				this.currentState.entry.from.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
				this.currentState.entry.to.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
				BX.addClass(dayNode, 'calendar-grid-drag-select');
			};
			dayNode.onbxdestdraghout = () => {
				BX.removeClass(dayNode, 'calendar-grid-drag-select');
			};
		},

		registerTimelineDay: function(day)
		{
			const dayNode = day.node;
			const date = day.date;
			jsDD.registerDest(dayNode);

			dayNode.onbxdestdraghover = BX.delegate(function()
			{
				if (this.draggedNode)
				{
					const posLeft = BX.pos(dayNode).left;
					if (Math.abs(posLeft - parseInt(this.draggedNode.style.left)) > 30)
					{
						if (this.currentState.day)
						{
							this.currentState.day = this.calendar.getView().getDayByCode(dayNode.getAttribute('data-bx-calendar-timeline-day'));
							this.currentState.entry.from.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
							this.currentState.entry.to.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
							this.currentState.dayNode = dayNode;
						}
						this.draggedNode.style.left = (BX.pos(dayNode).left + 2) + 'px';
					}
					BX.addClass(dayNode, 'calendar-timeline-drag-select');
				}
			}, this);
			dayNode.onbxdestdraghout = BX.delegate(function()
			{
				if (this.draggedNode)
				{
					BX.removeClass(dayNode, 'calendar-timeline-drag-select');
				}
			}, this);
		},

		registerEntry: function(node, params)
		{
			var dragAllowed = false;
			if (this.calendar.isExternalMode())
			{
				dragAllowed = params.entry && params.entry.data && params.entry.data.ALLOW_DRAGDROP;
			}
			else
			{
				dragAllowed = this.calendar.entryController.canDo(params.entry, 'edit') && !params.entry.isLocation();
			}

			jsDD.registerObject(node);

			node.onbxdragstart = BX.delegate(function()
			{
				if (!dragAllowed)
				{
					this.draggedNode = false;
					BX.addClass(node, 'calendar-entry-shake-mode');
					if (this.denyDragTimeout)
						clearTimeout(this.denyDragTimeout);
					this.denyDragTimeout = setTimeout(function(){BX.removeClass(node, 'calendar-entry-shake-mode');}, 1000);
					return;
				}

				this.currentState = params;
				this.draggedNode = document.body.appendChild(node.cloneNode(true));
				node.style.opacity = '0.3';
				BX.addClass(this.draggedNode, 'calendar-entry-drag-mode');
				BX.removeClass(this.draggedNode, 'calendar-event-line-start-yesterday');
				BX.removeClass(this.draggedNode, 'calendar-event-line-finish-tomorrow');
				BX.removeClass(this.draggedNode, 'calendar-event-block-wrap-past');

				this.calendar.getView().setDraggedEntry(this.currentState.entry);

				if (this.calendar.currentViewName === 'week' || this.calendar.currentViewName === 'day')
				{
					this.draggedNode.style.left = BX.pos(node).left + 'px';
					this.draggedNode.style.width = (this.calendar.getView().getDayWidth() - 5) + 'px';
					this.offset = BX.pos(this.calendar.getView().timeLinesCont).top;
					this.currentState.bottomBasePos = BX.pos(this.calendar.getView().bottomOffHours).bottom - 2;
				}
				else
				{
					this.draggedNode.style.width = this.calendar.getView().getDayWidth() + 'px';
				}

				var
					entry = this.currentState.entry,
					dayLength = entry.getLengthInDays(),
					innerContainer = this.draggedNode.querySelector('.calendar-event-line-inner-container'),
					lineInner = this.draggedNode.querySelector('.calendar-event-line-inner');

				if (this.calendar.getView().getDayByCode)
				{
					this.currentState.day = this.calendar.getView().getDayByCode(this.calendar.util.getDayCode(entry.from));
				}

				if (dayLength > 1)
				{
					var textNode = this.draggedNode.querySelector('.calendar-event-line-text');
					if (textNode)
					{
						textNode.innerHTML = '<span class="calendar-event-line-days-count">(' + BX.message('EC_DAY_LENGTH').replace('#COUNT#', dayLength) + ')</span> ' + textNode.innerHTML;
					}
				}

				if (innerContainer)
				{
					if (entry.isFullDay())
					{
						innerContainer.style.backgroundColor = this.calendar.util.hexToRgba(entry.color, 0.7);
						innerContainer.style.borderColor = this.calendar.util.hexToRgba(entry.color, 0.7);
					}
					else
					{
						if (entry.isLongWithTime())
						{
							innerContainer.style.borderColor = this.calendar.util.hexToRgba(entry.color, 0.7);
						}
					}
				}

				if (lineInner)
				{
					lineInner.style.maxWidth = '';
				}

				if (this.calendar.getView().allEventsPopup)
				{
					this.calendar.getView().allEventsPopup.close()
				}

				this.undoList.push(this.getEntryState(entry));
				this.isDragging = true;
				if (this.calendar.currentViewName === 'week' || this.calendar.currentViewName === 'day')
				{
					this.eventDragAndDrop.onDragStart(entry.to.getTime() - entry.from.getTime());
				}
			}, this);

			if (!dragAllowed)
			{
				return;
			}

			node.onbxdrag = BX.delegate(function(x, y)
			{
				if (!this.draggedNode)
				{
					return;
				}

				y -= 7;
				y = this.getPositionAfterScroll(x, y);
				this.dragEntry(x, y);
			}, this);

			node.onbxdragstop = () => {
				this.redoList = [];
				if (this.calendar.currentViewName === 'week' || this.calendar.currentViewName === 'day')
				{
					this.saveEntry({
						from: this.eventDragAndDrop.getFinalFrom(),
						to: this.eventDragAndDrop.getFinalTo()
					});
					this.stopWindowScroll();
					this.stopContainerScroll();
				}
				else
				{
					if (!this.currentState)
					{
						return;
					}
					this.saveEntry({
						from: this.currentState.entry.from,
						to: this.currentState.entry.to
					});
				}
			};

			if (params.part.params.resizerNodeTop)
			{
				this.registerResizer(params.part.params.resizerNodeTop, params, true);
			}
			if (params.part.params.resizerNodeBottom)
			{
				this.registerResizer(params.part.params.resizerNodeBottom, params, false);
			}
		},

		getPositionAfterScroll(x, y)
		{
			y = this.getPositionAfterBottomScroll(x, y);
			y = this.getPositionAfterTopScroll(x, y);

			if (this.doesViewportContainDraggedNode(y))
			{
				this.stopWindowScroll();
			}

			if (this.doesContainerContainDraggedNode(y))
			{
				this.stopContainerScroll();
			}

			return y;
		},

		getPositionAfterTopScroll(x, y)
		{
			const dragContainer = this.calendar.getView().gridWrap;
			const containerTop = BX.pos(dragContainer).top;
			const viewportTop = window.scrollY;

			if (y < viewportTop && viewportTop > containerTop)
			{
				this.scrollSpeed = this.getSpeed(y, viewportTop);
				y = viewportTop;
				this.setWindowTopScrollInterval(x, y);
			}

			if (y <= containerTop)
			{
				this.scrollSpeed = this.getSpeed(y, containerTop);
				y = containerTop;
				if (y < containerTop && viewportTop > containerTop)
				{
					y = viewportTop;
				}
				this.setContainerTopScrollInterval(x, y);
			}

			return y;
		},

		getPositionAfterBottomScroll(x, y)
		{
			const dragContainer = this.calendar.getView().gridWrap;
			const containerBottom = BX.pos(dragContainer).bottom - this.draggedNode.offsetHeight;
			const viewportBottom = window.innerHeight + window.scrollY - this.draggedNode.offsetHeight;

			if (y > viewportBottom && viewportBottom < containerBottom)
			{
				this.scrollSpeed = this.getSpeed(y, viewportBottom);
				y = viewportBottom;
				this.setWindowBottomScrollInterval(x, y);
			}

			if (y >= containerBottom)
			{
				this.scrollSpeed = this.getSpeed(y, containerBottom);
				y = containerBottom;
				if (y > viewportBottom && viewportBottom < containerBottom)
				{
					y = viewportBottom;
				}
				this.setContainerBottomScrollInterval(x, y);
			}

			return y;
		},

		getSpeed(y1, y2)
		{
			return Math.floor(Math.log(1 + Math.abs(y1 - y2))) + 1;
		},

		setWindowTopScrollInterval(x, y)
		{
			this.setWindowScrollInterval(x, y, this.setContainerTopScrollInterval.bind(this), -1);
		},

		setWindowBottomScrollInterval(x, y)
		{
			this.setWindowScrollInterval(x, y, this.setContainerBottomScrollInterval.bind(this), 1);
		},

		setWindowScrollInterval(x, y, setContainerScrollInterval, direction)
		{
			if (!this.windowScrollInterval)
			{
				this.windowScrollInterval = setInterval(() => {
					y += this.scrollSpeed * direction;
					document.documentElement.scrollTop += this.scrollSpeed * direction;
					this.dragEntry(x, y);

					if (!this.doesContainerContainDraggedNode(y))
					{
						this.stopWindowScroll(y);
						setContainerScrollInterval(x, y);
					}
				}, 13);
			}
		},

		setContainerTopScrollInterval(x, y)
		{
			this.setContainerScrollInterval(x, y, this.getScrollTop, -1);
		},

		setContainerBottomScrollInterval(x, y)
		{
			this.setContainerScrollInterval(x, y, this.getScrollBottom, 1);
		},

		getScrollTop(node)
		{
			return node.scrollTop;
		},

		getScrollBottom(node)
		{
			return parseInt(node.scrollHeight - node.clientHeight - node.scrollTop);
		},

		setContainerScrollInterval(x, y, getScroll, direction)
		{
			if (!this.containerScrollInterval)
			{
				const dragContainer = this.calendar.getView().gridWrap;
				this.containerScrollInterval = setInterval(() => {
					this.scrollSpeed = Math.min(this.scrollSpeed, getScroll(dragContainer));
					this.offset -= this.scrollSpeed * direction;
					dragContainer.scrollTop += this.scrollSpeed * direction;
					this.dragEntry(x, y);

					if (getScroll(dragContainer) === 0)
					{
						this.stopContainerScroll();
					}
				}, 13);
			}
		},

		doesViewportContainDraggedNode(y)
		{
			const viewportTop = window.scrollY;
			const viewportBottom = window.innerHeight + window.scrollY - this.draggedNode.offsetHeight;
			return (y > viewportTop && y < viewportBottom);
		},

		doesContainerContainDraggedNode(y)
		{
			const dragContainer = this.calendar.getView().gridWrap;
			const containerTop = BX.pos(dragContainer).top;
			const containerBottom = BX.pos(dragContainer).bottom - this.draggedNode.offsetHeight;
			return (y > containerTop && y < containerBottom);
		},

		stopWindowScroll()
		{
			clearInterval(this.windowScrollInterval);
			this.windowScrollInterval = false;
		},

		stopContainerScroll()
		{
			clearInterval(this.containerScrollInterval);
			this.containerScrollInterval = false;
		},

		dragEntry(x, y)
		{
			if (this.calendar.currentViewName === 'week' || this.calendar.currentViewName === 'day')
			{
				this.dragWeekDayEntry(y);
			}
			else
			{
				this.dragMonthEntry(x, y);
			}
		},

		dragWeekDayEntry: function(y)
		{
			const view = this.calendar.getView();
			const entry = this.currentState.entry;
			const nodeHeight = this.draggedNode.offsetHeight;
			let nodeTop = y;

			// manage off hours
			if (nodeTop < this.offset)
			{
				nodeTop = this.offset;
				this.shake(this.draggedNode);
			}
			if (nodeTop + nodeHeight > this.currentState.bottomBasePos)
			{
				nodeTop = this.currentState.bottomBasePos - nodeHeight;
				this.shake(this.draggedNode);
			}

			let fromTime = view.getTimeByPos(nodeTop - this.offset, 5);
			this.setStartTime(entry, fromTime);

			const boundary = this.eventDragAndDrop.getDragBoundary(nodeTop);
			if (boundary.wasMagnetized)
			{
				this.draggedNode.style.transition = 'left .2s, top .05s, height .1s';
			}
			else
			{
				this.draggedNode.style.transition = 'left .2s, height .1s';
			}

			if (parseInt(this.draggedNode.style.height) !== boundary.size)
			{
				// recalculate compactness in the end of height transition
				setTimeout(() => view.setCompactness(this.draggedNode), 100);
			}
			view.setCompactness(this.draggedNode);

			this.setBoundaryTimeToTimeNode(boundary, this.draggedNode);
			this.draggedNode.style.top = boundary.position + 'px';
			this.draggedNode.style.height = boundary.size + 'px';
		},

		dragMonthEntry: function(x, y)
		{
			this.draggedNode.style.top = (y - 3) + 'px';
			this.draggedNode.style.left = (x - 20) + 'px';
		},

		setStartTime: function(entry, fromTime)
		{
			entry.from.setHours(fromTime.h, fromTime.m);
			entry.to = new Date(entry.from.getTime() + (entry.data.DT_LENGTH - (entry.fullDay ? 1 : 0)) * 1000);
			if (this.calendar.util.getDayCode(entry.from) !== this.calendar.util.getDayCode(entry.to) && entry.to.getHours() === 0 && entry.to.getMinutes() === 0)
			{
				entry.to = new Date(entry.to.getTime() - 1000);
			}
		},

		shake: function(node)
		{
			BX.addClass(node, 'calendar-entry-shake-mode');
			if (this.shakeTimeout)
			{
				clearTimeout(this.shakeTimeout);
			}
			this.shakeTimeout = setTimeout(() => {
				BX.removeClass(node, 'calendar-entry-shake-mode');
			}, 400);
		},

		registerResizer: function(node, params, isTopResizer = false)
		{
			node.setAttribute('data-bx-entry-resizer', 'Y');

			node.onbxdragstart = (e) => {
				e = e || window.event;

				let entry = params.entry;
				if (params.part.params.wrapNode.offsetHeight === 0)
				{
					entry = this.getRealEntry(entry);
				}
				this.currentState = {
					entry,
					startY: e.clientY + BX.GetWindowSize().scrollTop
				};
				this.resizedNode = entry.parts[0].params.wrapNode;
				this.undoList.push(this.getEntryState(entry));
				this.calendar.getView().setResizedEntry(this.currentState.entry);
				this.offset = 0;

				const minHeight = parseInt(window.getComputedStyle(this.resizedNode).getPropertyValue("min-height"));
				this.resizeDragAndDrop.onDragStart(entry, minHeight, isTopResizer);
				this.isDragging = true;
			};

			jsDD.registerObject(node);

			node.onbxdrag = (x, y) =>
			{
				if (this.currentState && this.calendar.util.type !== 'location')
				{
					this.resizeWeekDayEntry(y - this.currentState.startY);
				}
			};

			node.onbxdragstop = () => {
				this.redoList = [];
				this.currentState.entry.from = this.resizeDragAndDrop.getFinalFrom();
				this.currentState.entry.to = this.resizeDragAndDrop.getFinalTo();
				this.saveEntry({
					from: this.resizeDragAndDrop.getFinalFrom(),
					to: this.resizeDragAndDrop.getFinalTo(),
				});
			};
		},

		resizeWeekDayEntry: function(dy)
		{
			document.body.style.cursor = 'ns-resize';
			const boundary = this.resizeDragAndDrop.getDragBoundary(dy);

			this.setBoundaryTimeToTimeNode(boundary, this.resizedNode);
			this.resizedNode.style.height = boundary.size + 'px';
			this.resizedNode.style.top = boundary.position + 'px';
			this.calendar.getView().setCompactness(this.resizedNode);
		},

		saveEntry: function(timeInterval)
		{
			if (!this.currentState)
			{
				return;
			}
			const realEntry = this.getRealEntry(this.currentState.entry);
			this.setTimeIntervalToEntry(realEntry, timeInterval);

			this.calendar.getView().setDraggedEntry(null);
			if (this.calendar.getView().setResizedEntry)
			{
				this.calendar.getView().setResizedEntry(null);
			}
			this.calendar.getView().displayEntries({reloadEntries: false});
			this.calendar.entryController.moveEventToNewDate(realEntry, realEntry.from, realEntry.to);

			if (this.currentState.dayNode)
			{
				BX.removeClass(this.currentState.dayNode, 'calendar-timeline-drag-select');
			}

			setTimeout(() => this.isDragging = false, 10);
			BX.remove(this.draggedNode);

			this.showEntryDraggedNotification();
		},

		setTimeIntervalToEntry: function(entry, timeInterval)
		{
			if (timeInterval)
			{
				entry.from = new Date(timeInterval.from.getTime());
				entry.to = new Date(timeInterval.to.getTime());
				entry.data.DT_LENGTH = (timeInterval.to.getTime() - timeInterval.from.getTime()) / 1000;
				entry.startDayCode = timeInterval.from;
				entry.endDayCode = timeInterval.to;
			}
		},

		getRealEntry: function(entry)
		{
			if (this.calendar.getView().getRealEntry)
			{
				return this.calendar.getView().getRealEntry(entry)
			}
			for (const realEntry of this.calendar.getView().entries)
			{
				if (realEntry.uid === entry.uid)
				{
					return realEntry;
				}
			}
			return null;
		},

		showEntryDraggedNotification: function()
		{
			if (this.redoList.length > 0)
			{
				return;
			}
			BX.Calendar.Util.showNotification(
				BX.Loc.getMessage('CALENDAR_SAVE_EVENT_NOTIFICATION'),
				[{
					title: BX.Loc.getMessage('CALENDAR_EVENT_DO_CANCEL'),
					events: {
						click: (e, balloon) => {
							this.undo();
							balloon.close();
						}
					}
				}]
			);
		},

		setBoundaryTimeToTimeNode(boundary, wrapNode)
		{
			const timeNode = wrapNode.querySelector('.calendar-event-block-time');
			if (timeNode)
			{
				timeNode.innerHTML = this.formatTimePeriod(boundary.from, boundary.to);
			}
		},

		formatTimePeriod(from, to)
		{
			return this.calendar.util.formatTime(from) + ' &ndash; ' + this.calendar.util.formatTime(to);
		},

	};

	function SectionSelector(params)
	{
		this.id = params.id || 'section-select-' + Math.round(Math.random() * 1000000);
		this.sectionList = params.sectionList;
		this.sectionGroupList = params.sectionGroupList;
		this.selectCallback = params.selectCallback;
		this.openPopupCallback = params.openPopupCallback;
		this.closePopupCallback = params.closePopupCallback;
		this.getCurrentSection = params.getCurrentSection;
		this.zIndex = params.zIndex || 1200;
		this.mode = params.mode;
		this.DOM = {
			outerWrap: params.outerWrap
		};

		this.init();
	}

	SectionSelector.prototype = {
		init: function()
		{
			this.DOM.select = this.DOM.outerWrap.appendChild(BX.create('DIV', {
				props: {className: 'calendar-field calendar-field-select' + (this.mode === 'compact' ? ' calendar-field-tiny' : '')},
				events: {
					click: BX.delegate(this.openPopup, this)
				}
			}));

			this.DOM.innerValue = this.DOM.select.appendChild(BX.create('DIV', {
				props: {className: 'calendar-field-select-icon'},
				style: {backgroundColor : this.getCurrentColor()}
			}));

			if (this.mode === 'full')
			{
				this.DOM.selectInnerText = this.DOM.select.appendChild(BX.create('SPAN', {text: this.getCurrentTitle()}));
			}
		},

		openPopup: function() {
			if (this.sectionMenu && this.sectionMenu.popupWindow && this.sectionMenu.popupWindow.isShown())
			{
				return this.sectionMenu.close();
			}

			var
				i, menuItems = [], icon;

			if (BX.type.isArray(this.sectionGroupList))
			{
				this.sectionGroupList.forEach(function(sectionGroup)
				{
					var filteredList = [], i;
					if (sectionGroup.belongsToView)
					{
						filteredList = this.sectionList.filter(function(section){
							return section.belongsToView();
						});
					}
					else if (sectionGroup.type === 'user')
					{
						filteredList = this.sectionList.filter(function(section){
							return section.type === 'user' && section.ownerId === sectionGroup.ownerId;
						});
					}
					else if (sectionGroup.type === 'company')
					{
						filteredList = this.sectionList.filter(function(section){
							return section.type === 'company_calendar'
								|| section.type === 'calendar_company'
								|| section.type === sectionGroup.type;
						});
					}
					else
					{
						filteredList = this.sectionList.filter(function(section){
							return section.type === sectionGroup.type;
						});
					}

					if (filteredList.length > 0)
					{
						menuItems.push(
							new BX.Main.Popup.MenuItem({
							text: sectionGroup.title,
							delimiter: true
						}));

						for (i = 0; i < filteredList.length; i++)
						{
							menuItems.push(this.getMenuItem(filteredList[i]));
						}
					}
				}, this);
			}
			else
			{
				for (i = 0; i < this.sectionList.length; i++)
				{
					menuItems.push(this.getMenuItem(this.sectionList[i]));
				}
			}

			this.sectionMenu = BX.PopupMenu.create(
				this.id,
				this.DOM.select,
				menuItems,
				{
					closeByEsc : true,
					autoHide : true,
					zIndex: this.zIndex,
					offsetTop: 0,
					offsetLeft: this.mode === 'compact' ? 40 : 0,
					angle: this.mode === 'compact'
				}
			);

			this.sectionMenu.popupWindow.contentContainer.style.overflow = "auto";
			this.sectionMenu.popupWindow.contentContainer.style.maxHeight = "400px";

			if (this.mode === 'full')
			{
				this.sectionMenu.popupWindow.setWidth(this.DOM.select.offsetWidth - 2);
				this.sectionMenu.popupWindow.contentContainer.style.overflowX = "hidden";
			}

			this.sectionMenu.show();

			// Paint round icons for section menu
			for (i = 0; i < this.sectionMenu.menuItems.length; i++)
			{
				if (this.sectionMenu.menuItems[i].layout.item)
				{
					icon = this.sectionMenu.menuItems[i].layout.item.querySelector('.menu-popup-item-icon');
					if (icon)
					{
						icon.style.backgroundColor = this.sectionMenu.menuItems[i].color;
					}
				}
			}

			BX.addClass(this.DOM.select, 'active');

			if (BX.type.isFunction(this.openPopupCallback))
			{
				this.openPopupCallback(this);
			}

			BX.addCustomEvent(this.sectionMenu.popupWindow, 'onPopupClose', BX.delegate(function()
			{
				if (BX.type.isFunction(this.openPopupCallback))
				{
					this.closePopupCallback();
				}
				BX.removeClass(this.DOM.select, 'active');
				BX.PopupMenu.destroy(this.id);
				this.sectionMenu = null;
			}, this));
		},

		getCurrentColor: function()
		{
			return (this.getCurrentSection() || {}).color || false;
		},

		getCurrentTitle: function()
		{
			return (this.getCurrentSection() || {}).name || '';
		},

		getPopup: function()
		{
			return this.sectionMenu;
		},

		getMenuItem: function(sectionItem)
		{
			var _this = this;
			return {
				text: BX.util.htmlspecialchars(sectionItem.name),
					color: sectionItem.color,
					className: 'calendar-add-popup-section-menu-item',
					onclick: (function (section)
				{
					return function ()
					{
						_this.DOM.innerValue.style.backgroundColor = section.color;
						if (_this.DOM.selectInnerText)
						{
							_this.DOM.selectInnerText.innerHTML = BX.util.htmlspecialchars(section.name);
						}

						if (BX.type.isFunction(_this.selectCallback))
						{
							_this.selectCallback(section);
						}
						_this.sectionMenu.close();
					}
				})(sectionItem)
			}
		}
	};

	if (window.BXEventCalendar)
	{
		window.BXEventCalendar.SelectInput = SelectInput;
		window.BXEventCalendar.NavigationCalendar = NavigationCalendar;
		window.BXEventCalendar.DragDrop = DragDrop;
		window.BXEventCalendar.SectionSelector = SectionSelector;
	}
	else
	{
		BX.addCustomEvent(window, "onBXEventCalendarInit", function()
		{
			window.BXEventCalendar.SelectInput = SelectInput;
			window.BXEventCalendar.NavigationCalendar = NavigationCalendar;
			window.BXEventCalendar.DragDrop = DragDrop;
			window.BXEventCalendar.SectionSelector = SectionSelector;
		});
	}
})(window);