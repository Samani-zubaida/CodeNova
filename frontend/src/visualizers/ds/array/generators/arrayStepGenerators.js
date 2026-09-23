/**
 * Step Generators for Array & Sorting Visualizers
 * Pure simulation functions producing playback animation steps.
 */

  export function generateMergeSortSteps(array = []) {
    const steps = [];
    const arr = [...array];
    const n = arr.length;

    steps.push({
      stepType: 'INIT',
      log: `> Merge Sort initialized on n = ${n} elements.`,
      codeLine: 0,
      array: [...arr],
      activeRange: { l: 0, m: Math.floor((n - 1) / 2), r: n - 1 },
      actionBanner: '🚀 Starting Merge Sort: Divide & Conquer Strategy.',
      description: 'Recursively divides array into halves until base cases (size 1), then merges sorted halves.'
    });

    function sort(l, r) {
      if (l >= r) {
        steps.push({
          stepType: 'BASE_CASE',
          log: `  [Base Case] Index [${l}] (${arr[l]}): Size 1 subarray is inherently sorted.`,
          codeLine: 1,
          array: [...arr],
          pointers: { base: l },
          highlightedIndices: [l],
          sortedIndices: [l],
          activeRange: { l, m: l, r },
          divideState: {
            range: `[${l}]`,
            val: arr[l],
            l, r
          },
          mergeState: null,
          actionBanner: `🎯 BASE CASE: Subarray [${l}] has only 1 element (${arr[l]}). Already sorted!`,
          description: `Subarrays of length 1 require no sorting.`
        });
        return;
      }

      const m = Math.floor((l + r) / 2);
      const leftPart = arr.slice(l, m + 1);
      const rightPart = arr.slice(m + 1, r + 1);

      // 1. DIVIDE ANIMATION STEP
      steps.push({
        stepType: 'DIVIDE',
        log: `✂️ DIVIDE: Splitting range [${l}...${r}] at midpoint m = ${m}.`,
        codeLine: 2,
        array: [...arr],
        pointers: { l, m, r },
        highlightedIndices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        activeRange: { l, m, r },
        divideState: {
          range: `[${l}...${r}]`,
          l, m, r,
          leftPart: [...leftPart],
          rightPart: [...rightPart]
        },
        mergeState: null,
        actionBanner: `✂️ DIVIDING: Range [${l}...${r}] ➔ Left Half [${l}...${m}] & Right Half [${m + 1}...${r}].`,
        description: `Divide step: Halves the subarray at index ${m}.`
      });

      // Recurse left half
      sort(l, m);

      // Recurse right half
      sort(m + 1, r);

      // 2. MERGE ANIMATION STEPS
      const left = arr.slice(l, m + 1);
      const right = arr.slice(m + 1, r + 1);

      steps.push({
        stepType: 'MERGE_START',
        log: `🔄 MERGE: Ready to combine sorted Left [${left.join(', ')}] and Right [${right.join(', ')}].`,
        codeLine: 5,
        array: [...arr],
        pointers: { l, r },
        highlightedIndices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        activeRange: { l, m, r },
        divideState: null,
        mergeState: {
          phase: 'start',
          range: `[${l}...${r}]`,
          l, m, r,
          leftSub: [...left],
          rightSub: [...right],
          activeI: 0,
          activeJ: 0,
          targetK: l,
          compared: null,
          mergedBuffer: [],
      merged: [],
          isComplete: false
        },
        actionBanner: `🔄 MERGING: Range [${l}...${r}] ➔ Combining Left [${left.join(', ')}] & Right [${right.join(', ')}].`,
        description: `Starting two-pointer comparison to merge into sorted order.`
      });

      let i = 0, j = 0, k = l;
      const buffer = [];

      while (i < left.length && j < right.length) {
        const valL = left[i];
        const valR = right[j];
        const isLeftSmaller = valL <= valR;

        // Step: Comparing Left[i] vs Right[j]
        steps.push({
          stepType: 'MERGE_COMPARE',
          log: `  Comparing left[${i}] (${valL}) vs right[${j}] (${valR}).`,
          codeLine: 11,
          array: [...arr],
          pointers: { i: l + i, j: m + 1 + j, k },
          highlightedIndices: [l + i, m + 1 + j],
          activeRange: { l, m, r },
          divideState: null,
          mergeState: {
            phase: 'compare',
            range: `[${l}...${r}]`,
            l, m, r,
            leftSub: [...left],
            rightSub: [...right],
            activeI: i,
            activeJ: j,
            targetK: k,
            compared: { leftVal: valL, rightVal: valR, winner: isLeftSmaller ? 'left' : 'right' },
            mergedBuffer: [...buffer],
      merged: [...buffer],
            isComplete: false
          },
          actionBanner: `⚖️ COMPARING: Left[${i}] (${valL}) vs Right[${j}] (${valR}) ➔ ${isLeftSmaller ? `${valL} ≤ ${valR} (Left smaller)` : `${valR} < ${valL} (Right smaller)`}`,
          description: `Evaluating which element comes next in sorted order.`
        });

        const chosenVal = isLeftSmaller ? valL : valR;
        buffer.push(chosenVal);
        arr[k] = chosenVal;

        // Step: Element placed into Merged Buffer
        steps.push({
          stepType: 'MERGE_PLACE',
          log: `  Placed ${chosenVal} into merged buffer at index ${k}.`,
          codeLine: isLeftSmaller ? 12 : 13,
          array: [...arr],
          pointers: { k },
          highlightedIndices: [k],
          activeRange: { l, m, r },
          divideState: null,
          mergeState: {
            phase: 'place',
            range: `[${l}...${r}]`,
            l, m, r,
            leftSub: [...left],
            rightSub: [...right],
            activeI: isLeftSmaller ? i + 1 : i,
            activeJ: isLeftSmaller ? j : j + 1,
            targetK: k + 1,
            compared: { leftVal: valL, rightVal: valR, winner: isLeftSmaller ? 'left' : 'right' },
            mergedBuffer: [...buffer],
      merged: [...buffer],
            isComplete: false
          },
          actionBanner: `⬇️ PLACED: Added ${chosenVal} to merged buffer for slot [${k}].`,
          description: `Element ${chosenVal} inserted into sorted buffer.`
        });

        if (isLeftSmaller) i++;
        else j++;
        k++;
      }

      // Flush remaining left elements
      while (i < left.length) {
        const val = left[i];
        buffer.push(val);
        arr[k] = val;
        steps.push({
          stepType: 'MERGE_FLUSH',
          log: `  Flushing remaining Left element (${val}) into index ${k}.`,
          codeLine: 14,
          array: [...arr],
          pointers: { i: l + i, k },
          highlightedIndices: [k],
          activeRange: { l, m, r },
          divideState: null,
          mergeState: {
            phase: 'flush',
            range: `[${l}...${r}]`,
            l, m, r,
            leftSub: [...left],
            rightSub: [...right],
            activeI: i + 1,
            activeJ: j,
            targetK: k + 1,
            compared: null,
            mergedBuffer: [...buffer],
      merged: [...buffer],
            isComplete: false
          },
          actionBanner: `➡️ FLUSHING: Right half exhausted; appending remaining Left (${val}) into slot [${k}].`,
          description: `Right half completed; copy remaining sorted left elements.`
        });
        i++;
        k++;
      }

      // Flush remaining right elements
      while (j < right.length) {
        const val = right[j];
        buffer.push(val);
        arr[k] = val;
        steps.push({
          stepType: 'MERGE_FLUSH',
          log: `  Flushing remaining Right element (${val}) into index ${k}.`,
          codeLine: 15,
          array: [...arr],
          pointers: { j: m + 1 + j, k },
          highlightedIndices: [k],
          activeRange: { l, m, r },
          divideState: null,
          mergeState: {
            phase: 'flush',
            range: `[${l}...${r}]`,
            l, m, r,
            leftSub: [...left],
            rightSub: [...right],
            activeI: i,
            activeJ: j + 1,
            targetK: k + 1,
            compared: null,
            mergedBuffer: [...buffer],
      merged: [...buffer],
            isComplete: false
          },
          actionBanner: `➡️ FLUSHING: Left half exhausted; appending remaining Right (${val}) into slot [${k}].`,
          description: `Left half completed; copy remaining sorted right elements.`
        });
        j++;
        k++;
      }

      // Range merge complete step
      steps.push({
        stepType: 'MERGE_DONE',
        log: `✅ Merged range [${l}...${r}] successfully: [${arr.slice(l, r + 1).join(', ')}].`,
        codeLine: 5,
        array: [...arr],
        pointers: {},
        sortedIndices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        highlightedIndices: Array.from({ length: r - l + 1 }, (_, idx) => l + idx),
        activeRange: { l, m, r },
        divideState: null,
        mergeState: {
          phase: 'done',
          range: `[${l}...${r}]`,
          l, m, r,
          leftSub: [...left],
          rightSub: [...right],
          activeI: left.length,
          activeJ: right.length,
          targetK: k,
          compared: null,
          mergedBuffer: [...buffer],
      merged: [...buffer],
          isComplete: true
        },
        actionBanner: `✨ MERGED: Range [${l}...${r}] sorted and written back to main array: [${arr.slice(l, r + 1).join(', ')}]!`,
        description: `Subarray [${l}...${r}] is now fully sorted in main array.`
      });
    }

    sort(0, n - 1);

    steps.push({
      stepType: 'COMPLETE',
      log: `🎉 Merge Sort complete! Final sorted array: [${arr.join(', ')}].`,
      codeLine: 6,
      array: [...arr],
      pointers: {},
      sortedIndices: Array.from({ length: n }, (_, idx) => idx),
      activeRange: null,
      divideState: null,
      mergeState: null,
      actionBanner: '🎉 Merge Sort Complete! All subarrays combined in O(n log n) time.',
      description: 'The entire array is now completely sorted.'
    });

    return steps;
  };

  // Trapping Rain Water Generator

  export function generateTrappingRainWaterSteps(array = []) {
    const steps = [];
    const heights = [...array];
    const n = heights.length;
    let l = 0;
    let r = n - 1;
    let leftMax = 0;
    let rightMax = 0;
    let totalWater = 0;
    const waterArr = new Array(n).fill(0);

    steps.push({
      log: `> Trapping Rain Water started.`,
      codeLine: 1,
      array: [...heights],
      waterHeights: [...waterArr],
      waterStats: { leftMax: 0, rightMax: 0, totalWater: 0 },
      pointers: { left: l, right: r },
      actionBanner: `Pointers set: Left wall at [0] (h=${heights[0]}), Right wall at [${n - 1}] (h=${heights[n - 1]}).`,
      description: `Left and right boundary pointers start at opposite ends.`
    });

    while (l < r) {
      const hL = heights[l];
      const hR = heights[r];

      if (hL < hR) {
        if (hL >= leftMax) {
          leftMax = hL;
          steps.push({
            log: `  Left wall [${l}] >= leftMax. New leftMax = ${leftMax}.`,
            codeLine: 4,
            array: [...heights],
            waterHeights: [...waterArr],
            waterStats: { leftMax, rightMax, totalWater },
            pointers: { left: l, right: r },
            highlightedIndices: [l],
            actionBanner: `⛰️ Left Wall updated to ${leftMax} at index [${l}].`,
            description: `Left boundary peak increases.`
          });
        } else {
          const trapped = leftMax - hL;
          totalWater += trapped;
          waterArr[l] = trapped;

          steps.push({
            log: `💧 Column [${l}]: Trapped = ${leftMax} - ${hL} = ${trapped} units!`,
            codeLine: 5,
            array: [...heights],
            waterHeights: [...waterArr],
            waterStats: { leftMax, rightMax, totalWater },
            pointers: { left: l, right: r },
            highlightedIndices: [l],
            actionBanner: `💧 Column [${l}] trapped: min(leftMax=${leftMax}, rightMax=${rightMax}) - height=${hL} = ${trapped} units!`,
            description: `Trapped ${trapped} units of water at column ${l}.`
          });
        }
        l++;
      } else {
        if (hR >= rightMax) {
          rightMax = hR;
          steps.push({
            log: `  Right wall [${r}] >= rightMax. New rightMax = ${rightMax}.`,
            codeLine: 7,
            array: [...heights],
            waterHeights: [...waterArr],
            waterStats: { leftMax, rightMax, totalWater },
            pointers: { left: l, right: r },
            highlightedIndices: [r],
            actionBanner: `⛰️ Right Wall updated to ${rightMax} at index [${r}].`,
            description: `Right boundary peak increases.`
          });
        } else {
          const trapped = rightMax - hR;
          totalWater += trapped;
          waterArr[r] = trapped;

          steps.push({
            log: `💧 Column [${r}]: Trapped = ${rightMax} - ${hR} = ${trapped} units!`,
            codeLine: 8,
            array: [...heights],
            waterHeights: [...waterArr],
            waterStats: { leftMax, rightMax, totalWater },
            pointers: { left: l, right: r },
            highlightedIndices: [r],
            actionBanner: `💧 Column [${r}] trapped: min(leftMax=${leftMax}, rightMax=${rightMax}) - height=${hR} = ${trapped} units!`,
            description: `Trapped ${trapped} units of water at column ${r}.`
          });
        }
        r--;
      }
    }

    steps.push({
      log: `🎉 Complete! Total trapped water = ${totalWater} units.`,
      codeLine: 11,
      array: [...heights],
      waterHeights: [...waterArr],
      waterStats: { leftMax, rightMax, totalWater },
      pointers: {},
      actionBanner: `🌊 Trapping Complete! Total Water: ${totalWater} units.`,
      description: `Finished calculation.`
    });

    return steps;
  };

  // Bubble Sort Generator

  export function generateBubbleSortSteps(array = []) {
    const steps = [];
    const arr = [...array];
    const n = arr.length;
    const sorted = new Set();

    steps.push({
      log: `> Bubble Sort started on n = ${n} elements.`,
      codeLine: 0,
      array: [...arr],
      pointers: { i: 0, j: 0 },
      actionBanner: 'Starting Pass i = 0. Comparing adjacent elements with pointer j.',
      description: `Bubble sort compares adjacent pairs [j] and [j+1].`
    });

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const valJ = arr[j];
        const valJNext = arr[j + 1];
        const isBigger = valJ > valJNext;

        steps.push({
          log: `  Comparing arr[${j}] (${valJ}) and arr[${j + 1}] (${valJNext}).`,
          codeLine: 2,
          array: [...arr],
          pointers: { i, j, 'j+1': j + 1 },
          highlightedIndices: [j, j + 1],
          actionBanner: isBigger 
            ? `⚠️ arr[${j}] (${valJ}) > arr[${j + 1}] (${valJNext}) ➔ Out of order! Swapping.`
            : `✅ arr[${j}] (${valJ}) ≤ arr[${j + 1}] (${valJNext}) ➔ In correct relative order.`,
          description: isBigger ? `Swap elements into ascending order.` : `Elements are in correct relative order.`
        });

        if (isBigger) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;

          steps.push({
            log: `    Swapped: [${arr[j]}, ${arr[j + 1]}].`,
            codeLine: 3,
            array: [...arr],
            pointers: { i, j, 'j+1': j + 1 },
            swappingIndices: [j, j + 1],
            actionBanner: `🔄 Swapped: ${valJ} ⟷ ${valJNext}`,
            description: `Swapped elements at index ${j} and ${j + 1}.`
          });
        }
      }

      const sortedIdx = n - i - 1;
      sorted.add(sortedIdx);
      steps.push({
        log: `  Element ${arr[sortedIdx]} locked at sorted index [${sortedIdx}].`,
        codeLine: 6,
        array: [...arr],
        pointers: { i },
        sortedIndices: Array.from(sorted),
        actionBanner: `🔒 Max element (${arr[sortedIdx]}) locked at index [${sortedIdx}].`,
        description: `Pass i = ${i} complete.`
      });
    }

    steps.push({
      log: `> Bubble Sort complete!`,
      codeLine: 6,
      array: [...arr],
      pointers: {},
      sortedIndices: arr.map((_, idx) => idx),
      actionBanner: '🎉 Array is fully sorted!',
      description: `All passes finished.`
    });

    return steps;
  };

  // Quick Sort Generator (Lomuto Partition)

  export function generateQuickSortSteps(array = []) {
    const steps = [];
    const arr = [...array];
    const n = arr.length;

    steps.push({
      log: `> Quick Sort started on n = ${n} elements.`,
      codeLine: 0,
      array: [...arr],
      actionBanner: '🚀 Quick Sort: Partitioning around pivot element.',
      description: 'Elements smaller than pivot move left; larger move right.'
    });

    function partition(low, high) {
      const pivot = arr[high];
      let i = low - 1;

      steps.push({
        log: `  Partitioning [${low}...${high}] with pivot = ${pivot} at index [${high}].`,
        codeLine: 8,
        array: [...arr],
        pointers: { pivot: high, i: Math.max(low, i), j: low },
        highlightedIndices: [high],
        actionBanner: `🎯 Pivot chosen: arr[${high}] = ${pivot}. Scanning elements with pointer j.`,
        description: `Elements < ${pivot} will be placed before index i.`
      });

      for (let j = low; j < high; j++) {
        const isSmaller = arr[j] < pivot;
        steps.push({
          log: `    Comparing arr[${j}] (${arr[j]}) < pivot (${pivot})? ${isSmaller}`,
          codeLine: 11,
          array: [...arr],
          pointers: { pivot: high, i: Math.max(0, i), j },
          highlightedIndices: [j, high],
          actionBanner: isSmaller 
            ? `✅ arr[${j}] (${arr[j]}) < pivot (${pivot}) ➔ Increment i & swap.`
            : `❌ arr[${j}] (${arr[j]}) ≥ pivot (${pivot}) ➔ Keep moving.`,
          description: `Evaluating element against pivot.`
        });

        if (isSmaller) {
          i++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          steps.push({
            log: `    Swapped arr[${i}] and arr[${j}].`,
            codeLine: 13,
            array: [...arr],
            pointers: { pivot: high, i, j },
            swappingIndices: [i, j],
            actionBanner: `🔄 Swapped: ${arr[i]} ⟷ ${arr[j]} into smaller partition.`,
            description: `Shifted smaller element leftward.`
          });
        }
      }

      // Swap pivot into place
      const temp = arr[i + 1];
      arr[i + 1] = arr[high];
      arr[high] = temp;

      steps.push({
        log: `  Pivot ${pivot} placed at final position index [${i + 1}].`,
        codeLine: 15,
        array: [...arr],
        pointers: { pivot: i + 1 },
        sortedIndices: [i + 1],
        swappingIndices: [i + 1, high],
        actionBanner: `🔒 Pivot ${pivot} locked at sorted index [${i + 1}]!`,
        description: `Pivot is now in its permanently sorted position.`
      });

      return i + 1;
    }

    function qSort(low, high) {
      if (low < high) {
        const pi = partition(low, high);
        qSort(low, pi - 1);
        qSort(pi + 1, high);
      }
    }

    qSort(0, n - 1);

    steps.push({
      log: `> Quick Sort complete!`,
      codeLine: 5,
      array: [...arr],
      pointers: {},
      sortedIndices: arr.map((_, idx) => idx),
      actionBanner: '🎉 Quick Sort Complete! Array fully sorted.',
      description: 'All partitions resolved.'
    });

    return steps;
  };

  // Insertion Sort Generator

  export function generateInsertionSortSteps(array = []) {
    const steps = [];
    const arr = [...array];
    const n = arr.length;

    steps.push({
      log: `> Insertion Sort started.`,
      codeLine: 0,
      array: [...arr],
      pointers: { i: 1 },
      actionBanner: '🚀 Insertion Sort: Incrementally building sorted prefix.',
      description: 'Extracting key element and shifting larger elements to the right.'
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];
      let j = i - 1;

      steps.push({
        log: `  Picking key = arr[${i}] (${key}).`,
        codeLine: 2,
        array: [...arr],
        pointers: { key: i, j },
        highlightedIndices: [i],
        actionBanner: `🔑 Selected Key = ${key} at index [${i}]. Shifting elements > ${key} right.`,
        description: `Comparing key with sorted prefix.`
      });

      while (j >= 0 && arr[j] > key) {
        steps.push({
          log: `    arr[${j}] (${arr[j]}) > key (${key}) ➔ Shifting arr[${j}] to index [${j + 1}].`,
          codeLine: 5,
          array: [...arr],
          pointers: { key: i, j },
          highlightedIndices: [j, j + 1],
          actionBanner: `➡️ Shifting ${arr[j]} from [${j}] ➔ [${j + 1}].`,
          description: `Creating slot for key.`
        });

        arr[j + 1] = arr[j];
        j--;
      }

      arr[j + 1] = key;

      steps.push({
        log: `  Inserted key ${key} at index [${j + 1}].`,
        codeLine: 8,
        array: [...arr],
        pointers: { inserted: j + 1 },
        sortedIndices: Array.from({ length: i + 1 }, (_, idx) => idx),
        actionBanner: `✅ Inserted key ${key} into sorted position [${j + 1}].`,
        description: `Prefix [0...${i}] is now sorted.`
      });
    }

    steps.push({
      log: `> Insertion Sort complete!`,
      codeLine: 9,
      array: [...arr],
      pointers: {},
      sortedIndices: arr.map((_, idx) => idx),
      actionBanner: '🎉 Insertion Sort Complete!',
      description: 'Array fully sorted.'
    });

    return steps;
  };

  // Binary Search Generator

  export function generateBinarySearchSteps(array = [], searchTarget = 77) {
    const steps = [];
    const arr = [...array].sort((a, b) => a - b);
    const target = parseInt(searchTarget, 10) || 77;
    let low = 0;
    let high = arr.length - 1;

    steps.push({
      log: `> Binary Search for target = ${target}.`,
      codeLine: 1,
      array: [...arr],
      pointers: { low, high },
      highlightedIndices: [low, high],
      actionBanner: `Search space: low = 0, high = ${high}. Target = ${target}.`,
      description: `Binary search divides search space by half.`
    });

    let found = false;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      const midVal = arr[mid];

      steps.push({
        log: `  Midpoint index [${mid}] = ${midVal}.`,
        codeLine: 3,
        array: [...arr],
        pointers: { low, mid, high },
        highlightedIndices: [mid],
        actionBanner: `🔍 Checking Midpoint index [${mid}] = ${midVal} vs Target ${target}.`,
        description: `Examining mid element arr[${mid}] = ${midVal}.`
      });

      if (midVal === target) {
        found = true;
        steps.push({
          log: `🎯 Target ${target} found at index [${mid}]!`,
          codeLine: 4,
          array: [...arr],
          pointers: { mid },
          sortedIndices: [mid],
          actionBanner: `🎯 Found target ${target} at index [${mid}]!`,
          description: `Target located in O(log n) time.`
        });
        break;
      } else if (midVal < target) {
        steps.push({
          log: `  ${midVal} < ${target} ➔ Discarding left half [${low} ... ${mid}].`,
          codeLine: 5,
          array: [...arr],
          pointers: { low: mid + 1, high },
          eliminatedRange: { start: 0, end: mid },
          actionBanner: `➡️ ${midVal} < ${target} ➔ Shifting low to ${mid + 1}.`,
          description: `Target is larger than mid.`
        });
        low = mid + 1;
      } else {
        steps.push({
          log: `  ${midVal} > ${target} ➔ Discarding right half [${mid} ... ${high}].`,
          codeLine: 6,
          array: [...arr],
          pointers: { low, high: mid - 1 },
          eliminatedRange: { start: mid, end: arr.length - 1 },
          actionBanner: `⬅️ ${midVal} > ${target} ➔ Shifting high to ${mid - 1}.`,
          description: `Target is smaller than mid.`
        });
        high = mid - 1;
      }
    }

    if (!found) {
      steps.push({
        log: `❌ Target ${target} not found.`,
        codeLine: 8,
        array: [...arr],
        pointers: {},
        actionBanner: `❌ Target ${target} not found in array.`,
        description: `Search space exhausted.`
      });
    }

    return steps;
  };

  // Two Sum Two-Pointer Generator

  export function generateTwoSumSteps(array = [], targetSum = 83) {
    const steps = [];
    const arr = [...array].sort((a, b) => a - b);
    const target = parseInt(targetSum, 10) || 83;
    let l = 0, r = arr.length - 1;

    steps.push({
      log: `> Two-Pointer Two-Sum started. Target = ${target}.`,
      codeLine: 1,
      array: [...arr],
      pointers: { left: l, right: r },
      highlightedIndices: [l, r],
      actionBanner: `Dual pointers initialized: left = [0], right = [${r}]. Target Sum = ${target}.`,
      description: 'Converging inwards from both ends.'
    });

    let found = false;
    while (l < r) {
      const curSum = arr[l] + arr[r];
      steps.push({
        log: `  arr[${l}] (${arr[l]}) + arr[${r}] (${arr[r]}) = ${curSum}.`,
        codeLine: 3,
        array: [...arr],
        pointers: { left: l, right: r },
        highlightedIndices: [l, r],
        actionBanner: `Current Sum: ${arr[l]} + ${arr[r]} = ${curSum} (Target: ${target}).`,
        description: `Checking pair sum.`
      });

      if (curSum === target) {
        found = true;
        steps.push({
          log: `🎯 Pair found! indices [${l}, ${r}] sum to ${target}.`,
          codeLine: 4,
          array: [...arr],
          pointers: { left: l, right: r },
          sortedIndices: [l, r],
          actionBanner: `🎯 Solution Pair Found: arr[${l}] (${arr[l]}) + arr[${r}] (${arr[r]}) = ${target}!`,
          description: `Target sum satisfied in O(n) time.`
        });
        break;
      } else if (curSum < target) {
        steps.push({
          log: `  Sum ${curSum} < ${target} ➔ Advancing left pointer.`,
          codeLine: 5,
          array: [...arr],
          pointers: { left: l + 1, right: r },
          actionBanner: `⬆️ Sum too small: Moving left pointer to [${l + 1}].`,
          description: `Increasing sum.`
        });
        l++;
      } else {
        steps.push({
          log: `  Sum ${curSum} > ${target} ➔ Decrementing right pointer.`,
          codeLine: 6,
          array: [...arr],
          pointers: { left: l, right: r - 1 },
          actionBanner: `⬇️ Sum too large: Moving right pointer to [${r - 1}].`,
          description: `Decreasing sum.`
        });
        r--;
      }
    }

    if (!found) {
      steps.push({
        log: `❌ No two numbers sum to ${target}.`,
        codeLine: 8,
        array: [...arr],
        pointers: {},
        actionBanner: `❌ No valid two-sum pair exists for target ${target}.`,
        description: `Search completed.`
      });
    }

    return steps;
  };

  // Dutch National Flag Generator

  export function generateDutchFlagSteps(array = []) {
    const steps = [];
    const arr = [...array];
    let low = 0, mid = 0, high = arr.length - 1;

    steps.push({
      log: `> Dutch National Flag (3-way partition) started.`,
      codeLine: 1,
      array: [...arr],
      pointers: { low, mid, high },
      actionBanner: '🚀 Dijkstra 3-way partition: Sorting 0s, 1s, and 2s.',
      description: 'Using low, mid, and high pointers.'
    });

    while (mid <= high) {
      const val = arr[mid];
      if (val === 0) {
        steps.push({
          log: `  arr[${mid}] is 0 ➔ Swapping with arr[${low}].`,
          codeLine: 3,
          array: [...arr],
          pointers: { low, mid, high },
          swappingIndices: [low, mid],
          actionBanner: `🔴 Element 0 found: Swap arr[${mid}] with arr[${low}]. Advance low & mid.`,
          description: `Placing 0 in left segment.`
        });
        const temp = arr[low];
        arr[low] = arr[mid];
        arr[mid] = temp;
        low++;
        mid++;
      } else if (val === 1) {
        steps.push({
          log: `  arr[${mid}] is 1 ➔ In place, advancing mid.`,
          codeLine: 6,
          array: [...arr],
          pointers: { low, mid, high },
          highlightedIndices: [mid],
          actionBanner: `⚪ Element 1 found: Already in middle segment. Advance mid to [${mid + 1}].`,
          description: `Leaving 1 in middle.`
        });
        mid++;
      } else {
        steps.push({
          log: `  arr[${mid}] is 2 ➔ Swapping with arr[${high}].`,
          codeLine: 8,
          array: [...arr],
          pointers: { low, mid, high },
          swappingIndices: [mid, high],
          actionBanner: `🔵 Element 2 found: Swap arr[${mid}] with arr[${high}]. Decrement high.`,
          description: `Placing 2 in right segment.`
        });
        const temp = arr[mid];
        arr[mid] = arr[high];
        arr[high] = temp;
        high--;
      }
    }

    steps.push({
      log: `> Dutch National Flag partitioning complete!`,
      codeLine: 11,
      array: [...arr],
      pointers: {},
      sortedIndices: arr.map((_, idx) => idx),
      actionBanner: '🎉 3-Way Partition Complete! 0s, 1s, and 2s segregated.',
      description: 'Finished in single pass O(n).'
    });

    return steps;
  };

  // Universal Dispatcher

export function generateArraySteps(algoId, array, { searchTarget, targetSum } = {}) {
  switch (algoId) {
    case 'trapping_rain':
      return generateTrappingRainWaterSteps(array);
    case 'mergesort':
      return generateMergeSortSteps(array);
    case 'quicksort':
      return generateQuickSortSteps(array);
    case 'insertionsort':
      return generateInsertionSortSteps(array);
    case 'binary_search':
      return generateBinarySearchSteps(array, searchTarget);
    case 'two_sum':
      return generateTwoSumSteps(array, targetSum);
    case 'dutch_flag':
      return generateDutchFlagSteps(array);
    case 'bubblesort':
    default:
      return generateBubbleSortSteps(array);
  }
}
