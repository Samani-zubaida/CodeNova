// Step Generators for Stack Suite Algorithms

export const buildParenthesesSteps = (tokens) => {
    const recorded = [];
    const st = [];
    const matchMap = { ')': '(', '}': '{', ']': '[' };

    recorded.push({
      action: "Begin validation scan",
      intuition: "Scan expression from left to right. Push open brackets; match and pop corresponding closing brackets.",
      next: "Examine first character.",
      tokens: [...tokens],
      activeIdx: -1,
      stack: [],
      status: 'idle',
      variables: { index: 0, char: tokens[0] || 'none', stackSize: 0, status: 'Scanning' },
      activeLine: 4
    });

    let isValid = true;
    for (let i = 0; i < tokens.length; i++) {
      const c = tokens[i];
      if ('({['.includes(c)) {
        st.push(c);
        recorded.push({
          action: `Open bracket '${c}' encountered at [${i}]`,
          intuition: `Open bracket requires a matching '${c === '(' ? ')' : c === '{' ? '}' : ']'}' in the future. Push onto stack.`,
          next: i + 1 < tokens.length ? `Next character is '${tokens[i + 1]}'` : "End of string reached.",
          tokens: [...tokens],
          activeIdx: i,
          stack: [...st],
          status: 'scanning',
          variables: { index: i, char: c, stackTop: c, stackSize: st.length },
          activeLine: 5
        });
      } else if (')}]'.includes(c)) {
        if (st.length === 0) {
          isValid = false;
          recorded.push({
            action: `Premature closing bracket '${c}' at [${i}] with EMPTY stack!`,
            intuition: "Cannot match closing bracket because there are no pending opening brackets.",
            next: "Validation failed: Unmatched closer.",
            tokens: [...tokens],
            activeIdx: i,
            stack: [],
            status: 'invalid',
            variables: { index: i, char: c, error: 'Empty Stack on Closer', isValid: false },
            activeLine: 6
          });
          break;
        }

        const top = st.pop();
        if (top !== matchMap[c]) {
          isValid = false;
          recorded.push({
            action: `Mismatched bracket! Expected matching closing bracket for '` + top + `', got '` + c + `'`,
            intuition: `LIFO violation: '${c}' does not match the most recently opened bracket '${top}'.`,
            next: "Validation failed: Bracket mismatch.",
            tokens: [...tokens],
            activeIdx: i,
            stack: [...st],
            status: 'invalid',
            variables: { index: i, expected: matchMap[c], got: top, isValid: false },
            activeLine: 6
          });
          break;
        } else {
          recorded.push({
            action: `Bracket match successful! Matched '${top}' with '${c}'`,
            intuition: `Popped '${top}' from stack. Sub-expression is balanced.`,
            next: i + 1 < tokens.length ? `Proceed to token [${i + 1}]: '${tokens[i + 1]}'` : "All tokens processed.",
            tokens: [...tokens],
            activeIdx: i,
            stack: [...st],
            status: 'scanning',
            variables: { index: i, matchedPair: `${top}${c}`, remainingStack: st.length },
            activeLine: 6
          });
        }
      }
    }

    if (isValid) {
      if (st.length === 0) {
        recorded.push({
          action: "✅ Expression is perfectly BALANCED!",
          intuition: "Every opening bracket found its exact closing partner in proper nested order.",
          next: "Algorithm complete.",
          tokens: [...tokens],
          activeIdx: tokens.length,
          stack: [],
          status: 'valid',
          variables: { result: 'BALANCED', isValid: true, stackSize: 0 },
          activeLine: 8
        });
      } else {
        recorded.push({
          action: `❌ Unbalanced! ${st.length} opening bracket(s) never closed.`,
          intuition: `Remaining unclosed brackets in stack: [${st.join(', ')}].`,
          next: "Validation failed: Missing closing bracket.",
          tokens: [...tokens],
          activeIdx: tokens.length,
          stack: [...st],
          status: 'invalid',
          variables: { result: 'UNBALANCED', unclosed: st.join(' '), isValid: false },
          activeLine: 8
        });
      }
    }
    return recorded;
  };

export const buildPostfixSteps = (tokens) => {
    const recorded = [];
    const st = [];

    recorded.push({
      action: "RPN Evaluation initialized",
      intuition: "Operands are pushed onto stack. When an operator is encountered, pop 2 operands, evaluate, and push result back.",
      next: "Read first token from left to right.",
      tokens: [...tokens],
      activeIdx: -1,
      stack: [],
      lastOp: null,
      variables: { tokenIndex: 0, stackSize: 0 },
      activeLine: 2
    });

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (!isNaN(t)) {
        const num = Number(t);
        st.push(num);
        recorded.push({
          action: `Encountered operand ${num} -> Push to stack`,
          intuition: "Numbers wait in the LIFO stack until an operator consumes them.",
          next: i + 1 < tokens.length ? `Next token: '${tokens[i + 1]}'` : "Finish evaluation.",
          tokens: [...tokens],
          activeIdx: i,
          stack: [...st],
          lastOp: null,
          variables: { tokenIndex: i, token: num, isOperand: true, stackTop: num, stackSize: st.length },
          activeLine: 4
        });
      } else if (['+', '-', '*', '/', '^'].includes(t)) {
        if (st.length < 2) {
          recorded.push({
            action: `⚠️ Error: Not enough operands for operator '${t}'!`,
            intuition: "Binary operators require at least 2 values in stack.",
            next: "Evaluation failed.",
            tokens: [...tokens],
            activeIdx: i,
            stack: [...st],
            lastOp: 'error',
            variables: { error: 'Stack Underflow on Operator', operator: t },
            activeLine: 6
          });
          break;
        }

        const b = st.pop();
        const a = st.pop();
        let res = 0;
        if (t === '+') res = a + b;
        else if (t === '-') res = a - b;
        else if (t === '*') res = a * b;
        else if (t === '/') res = Math.trunc(a / b);
        else if (t === '^') res = Math.pow(a, b);

        st.push(res);
        recorded.push({
          action: `Applied '${t}': ${a} ${t} ${b} = ${res}`,
          intuition: `Popped b=${b} (second operand) and a=${a} (first operand). Computed ${a} ${t} ${b} = ${res} and pushed ${res} back.`,
          next: i + 1 < tokens.length ? `Next token is '${tokens[i + 1]}'` : "All tokens processed.",
          tokens: [...tokens],
          activeIdx: i,
          stack: [...st],
          lastOp: { a, b, op: t, result: res },
          variables: { operator: t, operandA: a, operandB: b, computedResult: res, stackSize: st.length },
          activeLine: 7
        });
      }
    }

    if (st.length === 1) {
      recorded.push({
        action: `🎉 Final Evaluation Result = ${st[0]}`,
        intuition: "Expression evaluated completely. The single value remaining in the stack is the final answer.",
        next: "RPN evaluation complete.",
        tokens: [...tokens],
        activeIdx: tokens.length,
        stack: [...st],
        lastOp: null,
        variables: { finalResult: st[0], completed: true },
        activeLine: 12
      });
    }
    return recorded;
  };

export const buildInfixSteps = (tokens) => {
    const prec = { '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
    const recorded = [];
    const opStack = [];
    const out = [];

    recorded.push({
      action: "Shunting-Yard Parser initialized",
      intuition: "Operands stream straight to output. Operators wait on stack until lower/equal precedence operators force them to pop.",
      next: "Parse first token.",
      activeIdx: -1,
      opStack: [],
      output: [],
      variables: { index: 0, outputLength: 0, stackSize: 0 },
      activeLine: 2
    });

    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (!isNaN(t) || /[a-zA-Z]/.test(t)) {
        out.push(t);
        recorded.push({
          action: `Operand '${t}' streamed directly to Output`,
          intuition: "Operands preserve their relative left-to-right order in Reverse Polish Notation.",
          next: i + 1 < tokens.length ? `Next token: '${tokens[i + 1]}'` : "Empty remaining stack.",
          activeIdx: i,
          opStack: [...opStack],
          output: [...out],
          variables: { token: t, type: 'OPERAND', output: out.join(' ') },
          activeLine: 5
        });
      } else if (t === '(') {
        opStack.push(t);
        recorded.push({
          action: "Open parenthesis '(' pushed to Operator Stack",
          intuition: "'(' creates an isolated sub-expression frame with highest grouping precedence.",
          next: `Parse next token inside parenthesis.`,
          activeIdx: i,
          opStack: [...opStack],
          output: [...out],
          variables: { token: t, type: 'OPEN_PAREN', stack: opStack.join(' ') },
          activeLine: 6
        });
      } else if (t === ')') {
        recorded.push({
          action: "Closing parenthesis ')' found -> Pop operators until '('",
          intuition: "Sub-expression finished. Unwind operators inside this parenthesized block to output.",
          next: "Popping operators...",
          activeIdx: i,
          opStack: [...opStack],
          output: [...out],
          variables: { token: t, type: 'CLOSE_PAREN' },
          activeLine: 8
        });

        while (opStack.length && opStack[opStack.length - 1] !== '(') {
          const popped = opStack.pop();
          out.push(popped);
          recorded.push({
            action: `Popped '${popped}' to output buffer`,
            intuition: `Operator '${popped}' inside parentheses evaluated and emitted to postfix.`,
            next: opStack[opStack.length - 1] === '(' ? "Discard matching '('" : "Continue popping...",
            activeIdx: i,
            opStack: [...opStack],
            output: [...out],
            variables: { poppedOperator: popped, output: out.join(' ') },
            activeLine: 9
          });
        }
        if (opStack.length && opStack[opStack.length - 1] === '(') {
          opStack.pop(); // discard '('
          recorded.push({
            action: "Discarded matching '(' from stack",
            intuition: "Parentheses themselves do not appear in the final postfix expression.",
            next: i + 1 < tokens.length ? `Next token: '${tokens[i + 1]}'` : "Empty remaining stack.",
            activeIdx: i,
            opStack: [...opStack],
            output: [...out],
            variables: { discarded: '()', stack: opStack.join(' ') },
            activeLine: 10
          });
        }
      } else if (['+', '-', '*', '/', '^'].includes(t)) {
        while (
          opStack.length &&
          opStack[opStack.length - 1] !== '(' &&
          prec[opStack[opStack.length - 1]] >= prec[t]
        ) {
          const popped = opStack.pop();
          out.push(popped);
          recorded.push({
            action: `Operator '${popped}' has higher/equal precedence (>= '${t}') -> Pop to output`,
            intuition: `Precedence of '${popped}' (${prec[popped]}) >= '${t}' (${prec[t]}). Higher precedence operations must execute first.`,
            next: "Check next operator on stack.",
            activeIdx: i,
            opStack: [...opStack],
            output: [...out],
            variables: { incoming: t, poppedHigherPrec: popped, output: out.join(' ') },
            activeLine: 12
          });
        }

        opStack.push(t);
        recorded.push({
          action: `Pushed '${t}' onto Operator Stack`,
          intuition: `'${t}' waits until its right operand or lower precedence operator arrives.`,
          next: i + 1 < tokens.length ? `Next token: '${tokens[i + 1]}'` : "Flush stack.",
          activeIdx: i,
          opStack: [...opStack],
          output: [...out],
          variables: { pushedOp: t, prec: prec[t], stack: opStack.join(' ') },
          activeLine: 13
        });
      }
    }

    while (opStack.length) {
      const popped = opStack.pop();
      out.push(popped);
      recorded.push({
        action: `Flushed remaining operator '${popped}' to output`,
        intuition: "End of expression reached. Flush any remaining deferred operators.",
        next: opStack.length ? "Flush next operator" : "Complete.",
        activeIdx: tokens.length,
        opStack: [...opStack],
        output: [...out],
        variables: { flushedOp: popped, output: out.join(' ') },
        activeLine: 16
      });
    }

    recorded.push({
      action: `🎉 Infix to Postfix Complete: "${out.join(' ')}"`,
      intuition: "Unambiguous Reverse Polish Notation ready for O(n) linear evaluation without brackets.",
      next: "Conversion finished.",
      activeIdx: tokens.length,
      opStack: [],
      output: [...out],
      variables: { finalPostfix: out.join(' '), completed: true },
      activeLine: 18
    });
    return recorded;
  };

export const buildNgeSteps = (nums) => {
    const n = nums.length;
    const res = new Array(n).fill(-1);
    const stack = []; // store indices
    const recorded = [];

    recorded.push({
      action: "Monotonic Stack NGE initialized",
      intuition: "We maintain indices of elements in decreasing order. When we see a larger number, it resolves the next greater element for smaller items on top!",
      next: "Inspect first element.",
      activeIdx: -1,
      stack: [],
      result: [...res],
      variables: { currentIndex: 0, stack: '[]' },
      activeLine: 3
    });

    for (let i = 0; i < n; i++) {
      const currentVal = nums[i];

      recorded.push({
        action: `Examining nums[${i}] = ${currentVal}`,
        intuition: `Compare current value ${currentVal} against values pointed to by top of stack.`,
        next: stack.length ? `Check if ${currentVal} > nums[${stack[stack.length - 1]}] (${nums[stack[stack.length - 1]]})` : "Stack empty: Push index directly.",
        activeIdx: i,
        stack: [...stack],
        result: [...res],
        variables: { currentIndex: i, currentVal, stackTopIdx: stack[stack.length - 1] ?? 'empty' },
        activeLine: 5
      });

      while (stack.length && nums[stack[stack.length - 1]] < currentVal) {
        const topIdx = stack.pop();
        res[topIdx] = currentVal;
        recorded.push({
          action: `💥 Found Next Greater: nums[${i}] (${currentVal}) > nums[${topIdx}] (${nums[topIdx]})`,
          intuition: `The first element to the right of index ${topIdx} larger than ${nums[topIdx]} is ${currentVal}! Set res[${topIdx}] = ${currentVal}.`,
          next: stack.length ? `Continue popping if top < ${currentVal}` : `Push current index ${i} to stack.`,
          activeIdx: i,
          stack: [...stack],
          result: [...res],
          variables: { resolvedIndex: topIdx, resolvedVal: nums[topIdx], nextGreater: currentVal },
          activeLine: 7
        });
      }

      stack.push(i);
      recorded.push({
        action: `Pushed index ${i} (value ${currentVal}) onto monotonic stack`,
        intuition: `Stack maintains descending invariant: [${stack.map(idx => nums[idx]).join(', ')}].`,
        next: i + 1 < n ? `Proceed to index ${i + 1}` : "End of array reached. Remaining items have no next greater element.",
        activeIdx: i,
        stack: [...stack],
        result: [...res],
        variables: { pushedIndex: i, currentStackValues: stack.map(idx => nums[idx]).join(' ') },
        activeLine: 9
      });
    }

    recorded.push({
      action: "✅ Next Greater Element search complete!",
      intuition: "Indices left on stack have no larger element to their right, hence they remain -1.",
      next: "All elements processed in O(n) time.",
      activeIdx: n,
      stack: [...stack],
      result: [...res],
      variables: { completed: true, finalResults: res.join(', ') },
      activeLine: 11
    });
    return recorded;
  };

export const buildDailyTempSteps = (temps) => {
    const n = temps.length;
    const res = new Array(n).fill(0);
    const stack = []; // indices
    const recorded = [];

    recorded.push({
      action: "Daily Temperatures scan initialized",
      intuition: "Monotonic decreasing stack of day indices. When a warmer day arrives, resolve wait days for colder days on the stack!",
      next: "Inspect day 0.",
      activeIdx: -1,
      stack: [],
      result: [...res],
      variables: { currentDay: 0, stack: '[]', daysToWait: res.join(', ') },
      activeLine: 4
    });

    for (let i = 0; i < n; i++) {
      const curr = temps[i];

      recorded.push({
        action: `Day [${i}] temperature is ${curr}°`,
        intuition: `Compare ${curr}° against previous day at stack top (${stack.length ? temps[stack[stack.length - 1]] + '°' : 'none'}).`,
        next: stack.length ? `Check if ${curr}° > ${temps[stack[stack.length - 1]]}°` : "Stack empty: Push day onto stack.",
        activeIdx: i,
        stack: [...stack],
        result: [...res],
        variables: { day: i, temp: curr, stackTopDay: stack[stack.length - 1] ?? 'empty' },
        activeLine: 6
      });

      while (stack.length && temps[stack[stack.length - 1]] < curr) {
        const prevDay = stack.pop();
        const daysWaited = i - prevDay;
        res[prevDay] = daysWaited;

        recorded.push({
          action: `🔥 Warmer day! Day [${i}] (${curr}°) is warmer than Day [${prevDay}] (${temps[prevDay]}°)!`,
          intuition: `Days waited = ${i} - ${prevDay} = ${daysWaited} day(s). Recorded in result[${prevDay}] = ${daysWaited}.`,
          next: stack.length ? `Continue checking top of stack...` : `Push Day [${i}] to stack.`,
          activeIdx: i,
          stack: [...stack],
          result: [...res],
          variables: { resolvedDay: prevDay, warmerDay: i, daysWaited, stackSize: stack.length },
          activeLine: 8
        });
      }

      stack.push(i);
      recorded.push({
        action: `Pushed Day [${i}] (${curr}°) onto stack`,
        intuition: `Stack maintains strictly decreasing temperatures: [${stack.map(d => temps[d] + '°').join(', ')}].`,
        next: i + 1 < n ? `Proceed to Day [${i + 1}]` : "All days scanned.",
        activeIdx: i,
        stack: [...stack],
        result: [...res],
        variables: { pushedDay: i, stackTemps: stack.map(d => temps[d]).join(' ') },
        activeLine: 11
      });
    }

    recorded.push({
      action: "✅ Daily Temperatures evaluation finished!",
      intuition: "Unresolved days remaining in the stack have no warmer future day (wait time remains 0).",
      next: "Simulation complete.",
      activeIdx: n,
      stack: [...stack],
      result: [...res],
      variables: { completed: true, finalWaitDays: res.join(', ') },
      activeLine: 13
    });
    return recorded;
  };

export const buildHistogramSteps = (heights) => {
    const extended = [...heights, 0];
    const stack = []; // indices
    let maxArea = 0;
    let bestRect = null;
    const recorded = [];

    recorded.push({
      action: "Histogram Max Area scan initialized",
      intuition: "Monotonic increasing stack of bar indices. A shorter bar pops taller bars and computes their maximum rectangular area.",
      next: "Inspect bar 0.",
      activeIdx: -1,
      stack: [],
      maxArea: 0,
      activeRect: null,
      variables: { index: 0, stack: '[]', maxArea: 0 },
      activeLine: 3
    });

    for (let i = 0; i < extended.length; i++) {
      const h = extended[i];

      recorded.push({
        action: i < heights.length ? `Examining bar [${i}] with height ${h}` : `Processing end-of-array sentinel (height 0)`,
        intuition: `Compare current height ${h} against stack top bar (${stack.length ? heights[stack[stack.length - 1]] : 'none'}).`,
        next: stack.length && extended[stack[stack.length - 1]] > h ? `Taller bar at top will be popped to calculate its area!` : "Push bar index to stack.",
        activeIdx: i,
        stack: [...stack],
        maxArea,
        activeRect: bestRect,
        variables: { currentIdx: i, currentHeight: h, maxArea },
        activeLine: 6
      });

      while (stack.length && extended[stack[stack.length - 1]] > h) {
        const topIdx = stack.pop();
        const barHeight = extended[topIdx];
        const width = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;
        const leftBound = stack.length === 0 ? 0 : stack[stack.length - 1] + 1;
        const rightBound = i - 1;
        const area = barHeight * width;
        if (area > maxArea) {
          maxArea = area;
          bestRect = { left: leftBound, right: rightBound, height: barHeight, area };
        }

        recorded.push({
          action: `📐 Popped bar [${topIdx}] (height ${barHeight}) -> Rectangle area = ${width} × ${barHeight} = ${area}`,
          intuition: `Left bound is index ${leftBound}, right bound is index ${rightBound} (width ${width}). Area = ${barHeight} × ${width} = ${area}. Max Area is now ${maxArea}.`,
          next: stack.length && extended[stack[stack.length - 1]] > h ? `Pop next taller bar from stack...` : `Push bar [${i}] to stack.`,
          activeIdx: i,
          stack: [...stack],
          maxArea,
          activeRect: { left: leftBound, right: rightBound, height: barHeight, area },
          variables: { poppedBar: topIdx, barHeight, width, computedArea: area, currentMaxArea: maxArea },
          activeLine: 9
        });
      }

      stack.push(i);
      recorded.push({
        action: `Pushed index [${i}] (height ${h}) onto stack`,
        intuition: `Stack preserves ascending height invariant: [${stack.map(idx => extended[idx]).join(', ')}].`,
        next: i + 1 < extended.length ? `Proceed to next bar...` : "Finish calculation.",
        activeIdx: i,
        stack: [...stack],
        maxArea,
        activeRect: bestRect,
        variables: { pushedIndex: i, stackHeights: stack.map(idx => extended[idx]).join(' ') },
        activeLine: 12
      });
    }

    recorded.push({
      action: `🎉 Largest Rectangle in Histogram = ${maxArea} sq units!`,
      intuition: `Optimal rectangular boundary from index ${bestRect?.left ?? 0} to ${bestRect?.right ?? heights.length - 1} with height ${bestRect?.height ?? 0}.`,
      next: "Algorithm complete in O(n) linear time.",
      activeIdx: heights.length,
      stack: [],
      maxArea,
      activeRect: bestRect,
      variables: { completed: true, maximumRectangleArea: maxArea },
      activeLine: 15
    });
    return recorded;
  };

export const buildStockSpanSteps = (prices) => {
    const stack = []; // [{ price, span, dayIdx }]
    const spans = [];
    const recorded = [];

    recorded.push({
      action: "Online Stock Span tracker initialized",
      intuition: "Span is consecutive days before today with price <= today's price. The stack stores (price, span) pairs.",
      next: "Process Day 0.",
      activeIdx: -1,
      stack: [],
      results: new Array(prices.length).fill(null),
      variables: { day: 0, stackSize: 0 },
      activeLine: 3
    });

    for (let i = 0; i < prices.length; i++) {
      const p = prices[i];
      let span = 1;

      recorded.push({
        action: `Day [${i}] stock price: $${p}`,
        intuition: `Initial span is 1 (today). Check if stack has earlier prices <= $${p} to absorb.`,
        next: stack.length ? `Compare $${p} with stack top ($${stack[stack.length - 1].price})` : `No earlier days. Span is 1.`,
        activeIdx: i,
        stack: [...stack],
        results: [...spans, ...new Array(prices.length - spans.length).fill(null)],
        variables: { currentDay: i, price: p, baseSpan: 1 },
        activeLine: 6
      });

      while (stack.length && stack[stack.length - 1].price <= p) {
        const popped = stack.pop();
        span += popped.span;

        recorded.push({
          action: `📈 Price $${p} >= previous Day [${popped.dayIdx}] ($${popped.price})! Absorbed span +${popped.span} -> Span = ${span}`,
          intuition: `Because $${p} is higher, all ${popped.span} consecutive days covered by Day [${popped.dayIdx}] also count toward today's span!`,
          next: stack.length && stack[stack.length - 1].price <= p ? `Continue absorbing earlier days...` : `Push ($${p}, ${span}) to stack.`,
          activeIdx: i,
          stack: [...stack],
          results: [...spans, ...new Array(prices.length - spans.length).fill(null)],
          variables: { absorbedDay: popped.dayIdx, absorbedPrice: popped.price, accumulatedSpan: span },
          activeLine: 8
        });
      }

      stack.push({ price: p, span, dayIdx: i });
      spans.push(span);

      recorded.push({
        action: `Day [${i}] final span = ${span} day(s). Pushed to stack.`,
        intuition: `Today's price $${p} dominates ${span} consecutive days. Stored in stack: [${stack.map(s => `$${s.price}(${s.span}d)`).join(', ')}].`,
        next: i + 1 < prices.length ? `Proceed to Day [${i + 1}]` : "All prices calculated.",
        activeIdx: i,
        stack: [...stack],
        results: [...spans, ...new Array(prices.length - spans.length).fill(null)],
        variables: { day: i, price: p, finalSpan: span },
        activeLine: 11
      });
    }

    recorded.push({
      action: `🎉 Online Stock Span complete! Spans: [${spans.join(', ')}]`,
      intuition: "Amortized O(1) per day because each price is pushed and popped at most once.",
      next: "Simulation finished.",
      activeIdx: prices.length,
      stack: [...stack],
      results: [...spans],
      variables: { completed: true, allSpans: spans.join(', ') },
      activeLine: 13
    });
    return recorded;
  };

export const buildValidParenWildcardSteps = (tokens) => {
    const openStack = []; // stores indices of '('
    const starStack = []; // stores indices of '*'
    const matches = [];
    const recorded = [];

    recorded.push({
      action: "Wildcard Parentheses validation initialized",
      intuition: "Two stacks: one for '(' indices, one for '*' wildcard indices. Asterisks act as flexible tokens morphing into '(', ')', or empty ''.",
      next: "Scan token 0.",
      activeIdx: -1,
      openStack: [],
      starStack: [],
      status: 'idle',
      matches: [],
      variables: { charIndex: 0, openStackSize: 0, starStackSize: 0 },
      activeLine: 3
    });

    let isValid = true;
    for (let i = 0; i < tokens.length; i++) {
      const c = tokens[i];

      if (c === '(') {
        openStack.push(i);
        recorded.push({
          action: `Encountered '(' at [${i}] -> Push index to Open Stack`,
          intuition: "Waiting for matching ')' or future wildcard '*'.",
          next: i + 1 < tokens.length ? `Next token: '${tokens[i + 1]}'` : "Scan complete.",
          activeIdx: i,
          openStack: [...openStack],
          starStack: [...starStack],
          status: 'scanning',
          matches: [...matches],
          variables: { index: i, char: '(', openStack: openStack.join(' ') },
          activeLine: 6
        });
      } else if (c === '*') {
        starStack.push(i);
        recorded.push({
          action: `Encountered wildcard '*' at [${i}] -> Push index to Star Stack`,
          intuition: "'*' can act as '(', ')', or '' depending on future closing needs!",
          next: i + 1 < tokens.length ? `Next token: '${tokens[i + 1]}'` : "Scan complete.",
          activeIdx: i,
          openStack: [...openStack],
          starStack: [...starStack],
          status: 'scanning',
          matches: [...matches],
          variables: { index: i, char: '*', starStack: starStack.join(' ') },
          activeLine: 7
        });
      } else if (c === ')') {
        if (openStack.length > 0) {
          const matchedIdx = openStack.pop();
          matches.push({ from: matchedIdx, to: i, type: 'open' });
          recorded.push({
            action: `Encountered ')' at [${i}] -> Matched with '(' at [${matchedIdx}]`,
            intuition: "Prioritize pairing with a real '(' first so wildcards remain free for later balancing.",
            next: i + 1 < tokens.length ? `Next token: '${tokens[i + 1]}'` : "Scan complete.",
            activeIdx: i,
            openStack: [...openStack],
            starStack: [...starStack],
            status: 'scanning',
            matches: [...matches],
            variables: { matchedOpen: matchedIdx, closedAt: i, remainingOpen: openStack.length },
            activeLine: 9
          });
        } else if (starStack.length > 0) {
          const matchedIdx = starStack.pop();
          matches.push({ from: matchedIdx, to: i, type: 'star' });
          recorded.push({
            action: `Encountered ')' at [${i}] -> Open Stack empty, so '*' at [${matchedIdx}] acts as '('!`,
            intuition: "Wildcard '*' morphed into '(' to satisfy the closing bracket.",
            next: i + 1 < tokens.length ? `Next token: '${tokens[i + 1]}'` : "Scan complete.",
            activeIdx: i,
            openStack: [...openStack],
            starStack: [...starStack],
            status: 'scanning',
            matches: [...matches],
            variables: { wildcardUsedAsOpen: matchedIdx, closedAt: i },
            activeLine: 10
          });
        } else {
          isValid = false;
          recorded.push({
            action: `❌ Invalid! Closing bracket ')' at [${i}] has neither '(' nor '*' to match with!`,
            intuition: "Both open stack and star stack are empty. Unterminated right parenthesis.",
            next: "Validation failed.",
            activeIdx: i,
            openStack: [],
            starStack: [],
            status: 'invalid',
            matches: [...matches],
            variables: { error: 'Unmatched closing parenthesis', index: i, isValid: false },
            activeLine: 11
          });
          break;
        }
      }
    }

    if (isValid) {
      recorded.push({
        action: "Scan complete. Now balancing remaining '(' with trailing '*' wildcards...",
        intuition: "Any remaining '(' can only be closed by a '*' that appeared to its RIGHT (openIdx < starIdx).",
        next: "Check stack tops.",
        activeIdx: tokens.length,
        openStack: [...openStack],
        starStack: [...starStack],
        status: 'scanning',
        matches: [...matches],
        variables: { openRemaining: openStack.length, starRemaining: starStack.length },
        activeLine: 14
      });

      while (openStack.length && starStack.length) {
        if (openStack[openStack.length - 1] < starStack[starStack.length - 1]) {
          const oIdx = openStack.pop();
          const sIdx = starStack.pop();
          matches.push({ from: oIdx, to: sIdx, type: 'wildcardClose' });
          recorded.push({
            action: `Matched '(' at [${oIdx}] with wildcard '*' at [${sIdx}] (acting as ')')`,
            intuition: `Since index ${oIdx} < ${sIdx}, the star occurs after the parenthesis and can legally close it.`,
            next: openStack.length ? "Check next remaining '('..." : "All open brackets closed!",
            activeIdx: tokens.length,
            openStack: [...openStack],
            starStack: [...starStack],
            status: 'scanning',
            matches: [...matches],
            variables: { matchedOpen: oIdx, starAsCloser: sIdx },
            activeLine: 15
          });
        } else {
          isValid = false;
          recorded.push({
            action: `❌ Invalid! '(' at [${openStack[openStack.length - 1]}] occurs AFTER '*' at [${starStack[starStack.length - 1]}]`,
            intuition: "A '*' to the left cannot act as a closing bracket for an opening bracket that came after it.",
            next: "Validation failed.",
            activeIdx: tokens.length,
            openStack: [...openStack],
            starStack: [...starStack],
            status: 'invalid',
            matches: [...matches],
            variables: { error: 'Star occurred before open bracket', isValid: false },
            activeLine: 16
          });
          break;
        }
      }

      if (isValid) {
        if (openStack.length === 0) {
          recorded.push({
            action: "✅ Valid Parenthesis String! (Remaining '*' treated as empty string '')",
            intuition: "All '(' were successfully matched. Any leftover '*' are gracefully discarded as empty strings.",
            next: "Validation successful.",
            activeIdx: tokens.length,
            openStack: [],
            starStack: [...starStack],
            status: 'valid',
            matches: [...matches],
            variables: { isValid: true, result: 'VALID' },
            activeLine: 18
          });
        } else {
          recorded.push({
            action: `❌ Invalid! ${openStack.length} '(' opening bracket(s) never closed!`,
            intuition: `Unclosed brackets at indices [${openStack.join(', ')}].`,
            next: "Validation failed.",
            activeIdx: tokens.length,
            openStack: [...openStack],
            starStack: [...starStack],
            status: 'invalid',
            matches: [...matches],
            variables: { unclosedCount: openStack.length, isValid: false },
            activeLine: 18
          });
        }
      }
    }
    return recorded;
  };

export const buildBasicStackSteps = (initialStack = [15, 30, 45, 60], pushVal = 75) => {
  const recorded = [];
  let s = [...initialStack];

  recorded.push({
    action: `Initial Stack state with ${s.length} elements`,
    intuition: "Stack follows LIFO: Last-In, First-Out. Only the top element can be inspected or popped.",
    next: `Prepare to Push(${pushVal}) onto stack top.`,
    stack: [...s],
    highlightIdx: s.length - 1,
    variables: { topIndex: s.length - 1, topValue: s[s.length - 1], size: s.length, capacity: 8, status: 'Ready' },
    activeLine: 1
  });

  // Step 1: Push pushVal
  s.push(pushVal);
  recorded.push({
    action: `PUSH(${pushVal}): Added onto the top of the stack`,
    intuition: `Increment top pointer (index ${s.length - 1}) and write ${pushVal}. O(1) constant time operation.`,
    next: "Peek at the newly inserted top item.",
    stack: [...s],
    highlightIdx: s.length - 1,
    variables: { topIndex: s.length - 1, topValue: pushVal, size: s.length, capacity: 8, status: `Pushed ${pushVal}` },
    activeLine: 5
  });

  // Step 2: Peek
  recorded.push({
    action: `PEEK(): Top element is ${pushVal}`,
    intuition: "Peek returns the element at stack[top] without mutating or shrinking the stack. O(1) time.",
    next: "Now demonstrate POP() to remove the top item.",
    stack: [...s],
    highlightIdx: s.length - 1,
    variables: { topIndex: s.length - 1, peekValue: pushVal, size: s.length, status: 'Inspecting Top' },
    activeLine: 10
  });

  // Step 3: Pop pushVal
  const popped1 = s.pop();
  recorded.push({
    action: `POP(): Removed ${popped1} from top of stack`,
    intuition: `Top pointer decrements to ${s.length - 1}. ${popped1} is returned to caller. LIFO: last element in was first out.`,
    next: "Perform another POP() to see predecessor uncovered.",
    stack: [...s],
    highlightIdx: s.length - 1,
    variables: { poppedValue: popped1, topIndex: s.length - 1, topValue: s[s.length - 1], size: s.length, status: `Popped ${popped1}` },
    activeLine: 14
  });

  // Step 4: Pop 60
  const popped2 = s.pop();
  recorded.push({
    action: `POP(): Removed ${popped2}`,
    intuition: `Stack depth is now ${s.length}. Top element is now ${s[s.length - 1]}.`,
    next: `Push new value 99 onto stack.`,
    stack: [...s],
    highlightIdx: s.length - 1,
    variables: { poppedValue: popped2, topIndex: s.length - 1, topValue: s[s.length - 1], size: s.length, status: `Popped ${popped2}` },
    activeLine: 14
  });

  // Step 5: Push 99
  s.push(99);
  recorded.push({
    action: `PUSH(99): Added new element`,
    intuition: "Stack grows smoothly up to its max capacity. All insertions occur at the top boundary.",
    next: "Sequence complete. You can also manually push or pop anytime.",
    stack: [...s],
    highlightIdx: s.length - 1,
    variables: { topIndex: s.length - 1, topValue: 99, size: s.length, capacity: 8, status: 'Ready' },
    activeLine: 5
  });

  return recorded;
};

export const buildMinStackSteps = (initialMain = [18, 29, 12, 15], pushVal = 8) => {
  const recorded = [];
  let main = [...initialMain];
  let aux = [18, 18, 12, 12];

  recorded.push({
    action: "Min-Stack Initialized: Dual Stack Architecture",
    intuition: "Main stack holds elements; Aux Min Stack caches the minimum value at each depth level.",
    next: `Push(${pushVal}) into Min-Stack.`,
    mainStack: [...main],
    auxStack: [...aux],
    variables: { mainTop: main[main.length - 1], currentMin: aux[aux.length - 1], size: main.length },
    activeLine: 1
  });

  // Push pushVal
  const newMin = Math.min(pushVal, aux[aux.length - 1]);
  main.push(pushVal);
  aux.push(newMin);
  recorded.push({
    action: `PUSH(${pushVal}): Main adds ${pushVal}, Min Stack updates running min to ${newMin}`,
    intuition: `${pushVal} is compared to previous min (${aux[aux.length - 2]}). New min is min(${pushVal}, ${aux[aux.length - 2]}) = ${newMin}.`,
    next: "Call getMin() to retrieve current minimum in O(1).",
    mainStack: [...main],
    auxStack: [...aux],
    variables: { pushed: pushVal, runningMin: newMin, getMinResult: newMin, size: main.length },
    activeLine: 7
  });

  // getMin()
  recorded.push({
    action: `getMin() -> ${newMin} in O(1) Constant Time!`,
    intuition: "Instead of scanning the whole stack in O(n), we directly read auxStack.top() in O(1)!",
    next: `Now POP() the top element (${pushVal}).`,
    mainStack: [...main],
    auxStack: [...aux],
    variables: { minResult: newMin, complexity: 'O(1)', size: main.length },
    activeLine: 18
  });

  // Pop
  const popped = main.pop();
  aux.pop();
  const restoredMin = aux[aux.length - 1];
  recorded.push({
    action: `POP(): Removed ${popped}. Min Stack automatically rolls back min to ${restoredMin}!`,
    intuition: "Both stacks pop synchronously, restoring the previous minimum without any recalculation.",
    next: `getMin() now returns ${restoredMin} instantly.`,
    mainStack: [...main],
    auxStack: [...aux],
    variables: { popped, currentMin: restoredMin, size: main.length },
    activeLine: 12
  });

  return recorded;
};

export function generateStackSteps(algoId, input) {
  switch (algoId) {
    case 'basic':
      return buildBasicStackSteps();
    case 'minStack':
      return buildMinStackSteps();
    case 'parentheses':
      return buildParenthesesSteps(typeof input === 'string' ? input.split('') : input);
    case 'postfix':
      return buildPostfixSteps(typeof input === 'string' ? input.trim().split(/\s+/) : input);
    case 'infixToPostfix':
      return buildInfixSteps(typeof input === 'string' ? input.trim().split(/\s+/) : input);
    case 'nextGreater':
      return buildNgeSteps(typeof input === 'string' ? input.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x)) : input);
    case 'dailyTemp':
      return buildDailyTempSteps(typeof input === 'string' ? input.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x)) : input);
    case 'histogram':
      return buildHistogramSteps(typeof input === 'string' ? input.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x)) : input);
    case 'stockSpan':
      return buildStockSpanSteps(typeof input === 'string' ? input.split(',').map(x => parseInt(x.trim(), 10)).filter(x => !isNaN(x)) : input);
    case 'validParenWildcard':
      return buildValidParenWildcardSteps(typeof input === 'string' ? input.split('') : input);
    default:
      return [];
  }
}
