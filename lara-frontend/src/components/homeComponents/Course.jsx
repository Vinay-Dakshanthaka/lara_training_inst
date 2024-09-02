import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';
import ScrollToTopButton from '../ScrollToTopButton';
import './course.css'

const Course = () => {
  return (
    <div className='course-content-page'>
      <Container className="my-5 ">
        <h2 className="text-center" style={{color:'FF6A00'}}>JAVA DATA STRUCTURES AND ALGORITHMS (LEETCODE) COURSE</h2>
        <Card className="shadow mt-4">
          <Card.Body>
            <Row className="mb-3 text-center">
              <Col sm={4}>
                <h6>Duration : 4 Months</h6>
              </Col>
              <Col sm={4}>
                <h6>Course Hours : 120</h6>
              </Col>
              <Col sm={4}>
                <h6>Prerequisites : CORE JAVA BASICS</h6>
              </Col>
            </Row>
            <Container>
              <h4 className='text-center display-5'>Description</h4>
              <Row>
                <Col>
                  <ul className='lead '>
                    <li>Hands-on practice in every LeetCode DSA challenge</li>
                    <li>Practical usage explanation of every algorithm</li>
                    <li>Detailed explanation of time complexity and space complexity</li>
                    <li>Unique challenges and solutions not available elsewhere</li>
                    <li>Preparation for product-based MNC interviews</li>
                    <li>Comprehensive material for each algorithm from problem statement to use cases</li>
                    <li>Recorded videos for all algorithms available in LMS for unlimited access</li>
                    <li>Support groups on Facebook and WhatsApp for doubt clarification</li>
                    <li>In-class solution submissions on platforms like LeetCode and HackerRank</li>
                    <li>Weekly doubt clarification sessions</li>
                    <li>Continuous job application support until placement with unlimited drives</li>
                    <li>High chances of placement with a minimum package of 8LPA</li>
                  </ul>
                </Col>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      </Container>
      <Container>
        <Row>
          <Col>
            <Card>
              <h2 className='text-center display-5'>COURSE CONTENT</h2>
              <nav>
            <ul>
                <li><a href="#arrays" className='lead text-decoration-none'>Arrays</a></li>
                <li><a href="#strings" className='lead text-decoration-none'> Strings</a></li>
                <li><a href="#hashmap-sliding" className='lead text-decoration-none'>HashMap & Sliding Window Technique</a></li>
                <li><a href="#stacks-queues" className='lead text-decoration-none'>Stacks and Queues</a></li>
                <li><a href="#linked-list" className='lead text-decoration-none'>Linked List</a></li>
                <li><a href="#recursion" className='lead text-decoration-none'>Recursion</a></li>
                <li><a href="#binary-tree" className='lead text-decoration-none'>Trees: Binary Tree</a></li>
                <li><a href="#binary-search-tree" className='lead text-decoration-none'>Binary Search Tree</a></li>
                <li><a href="#dynamic-programming" className='lead text-decoration-none'>Dynamic Programming</a></li>
                <li><a href="#binary-search" className='lead text-decoration-none'>Binary Search</a></li>
            </ul>
        </nav>
        <h2 id="arrays">Arrays:</h2>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><a href="https://leetcode.com/problems/kth-largest-element-in-an-array/" target='_blank'>https://leetcode.com/problems/kth-largest-element-in-an-array/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/neither-minimum-nor-maximum/" target='_blank'>https://leetcode.com/problems/neither-minimum-nor-maximum/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/sort-colors/" target='_blank'>https://leetcode.com/problems/sort-colors/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/missing-number/" target='_blank'>https://leetcode.com/problems/missing-number/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/maximum-product-of-three-numbers/" target='_blank'>https://leetcode.com/problems/maximum-product-of-three-numbers/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/remove-duplicates-from-sorted-array/" target='_blank'>https://leetcode.com/problems/remove-duplicates-from-sorted-array/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://takeuforward.org/data-structure/left-rotate-the-array-by-one/" target='_blank'>https://takeuforward.org/data-structure/left-rotate-the-array-by-one/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/rotate-array/" target='_blank'>https://leetcode.com/problems/rotate-array/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/move-zeroes/" target='_blank'>https://leetcode.com/problems/move-zeroes/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/max-consecutive-ones/" target='_blank'>https://leetcode.com/problems/max-consecutive-ones/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/rotate-image/" target='_blank'>https://leetcode.com/problems/rotate-image/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/spiral-matrix/" target='_blank'>https://leetcode.com/problems/spiral-matrix/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/spiral-matrix-ii/" target='_blank'>https://leetcode.com/problems/spiral-matrix-ii/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock" target='_blank'>https://leetcode.com/problems/best-time-to-buy-and-sell-stock</a></ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
            <h2 id="strings">Strings</h2>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><a href="https://leetcode.com/problems/valid-anagram/" target='_blank'>https://leetcode.com/problems/valid-anagram/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/reverse-string/" target='_blank'>https://leetcode.com/problems/reverse-string/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/reverse-words-in-a-string/" target='_blank'>https://leetcode.com/problems/reverse-words-in-a-string/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/valid-palindrome/" target='_blank'>https://leetcode.com/problems/valid-palindrome/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/valid-palindrome-ii/" target='_blank'>https://leetcode.com/problems/valid-palindrome-ii/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/consecutive-characters/" target='_blank'>https://leetcode.com/problems/consecutive-characters/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/longest-common-prefix/" target='_blank'>https://leetcode.com/problems/longest-common-prefix/</a></ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
            <h2 id="hashmap-sliding">HashMap & Sliding window technique:</h2>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><a href="https://leetcode.com/problems/first-unique-character-in-a-string/" target='_blank'>https://leetcode.com/problems/first-unique-character-in-a-string/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/first-letter-to-appear-twice/" target='_blank'>https://leetcode.com/problems/first-letter-to-appear-twice/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/counting-frequencies-of-array-elements/" target='_blank'>https://www.geeksforgeeks.org/counting-frequencies-of-array-elements/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/sort-characters-by-frequency/" target='_blank'>https://leetcode.com/problems/sort-characters-by-frequency/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/two-sum/" target='_blank'>https://leetcode.com/problems/two-sum/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/find-a-pair-with-the-given-difference/" target='_blank'>https://www.geeksforgeeks.org/find-a-pair-with-the-given-difference/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/3sum/" target='_blank'>https://leetcode.com/problems/3sum/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/intersection-of-two-arrays/" target='_blank'>https://leetcode.com/problems/intersection-of-two-arrays/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/intersection-of-two-arrays-ii/" target='_blank'>https://leetcode.com/problems/intersection-of-two-arrays-ii/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/longest-substring-without-repeating-characters/" target='_blank'>https://leetcode.com/problems/longest-substring-without-repeating-characters/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/" target='_blank'>https://leetcode.com/problems/longest-substring-with-at-most-two-distinct-characters/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/" target='_blank'>https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/longest-repeating-character-replacement/" target='_blank'>https://leetcode.com/problems/longest-repeating-character-replacement/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/find-if-there-is-a-subarray-with-0-sum/" target='_blank'>https://www.geeksforgeeks.org/find-if-there-is-a-subarray-with-0-sum/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/subarray-sum-equals-k/" target='_blank'>https://leetcode.com/problems/subarray-sum-equals-k/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/subarray-sums-divisible-by-k/" target='_blank'>https://leetcode.com/problems/subarray-sums-divisible-by-k/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/valid-anagram/" target='_blank'>https://leetcode.com/problems/valid-anagram/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/group-anagrams/" target='_blank'>https://leetcode.com/problems/group-anagrams/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/max-consecutive-ones/" target='_blank'>https://leetcode.com/problems/max-consecutive-ones/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.lintcode.com/problem/883/" target='_blank'>https://www.lintcode.com/problem/883/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/max-consecutive-ones-iii/" target='_blank'>https://leetcode.com/problems/max-consecutive-ones-iii/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/lru-cache/" target='_blank'>https://leetcode.com/problems/lru-cache/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/sliding-window-maximum/" target='_blank'>https://leetcode.com/problems/sliding-window-maximum/</a></ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
            <h2 id="stacks-queues">Stacks and Queues:</h2>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/stack-data-structure/" target='_blank'>https://www.geeksforgeeks.org/stack-data-structure/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.javatpoint.com/ds-array-implementation-of-stack" target='_blank'>https://www.javatpoint.com/ds-array-implementation-of-stack</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/valid-parentheses/" target='_blank'>https://leetcode.com/problems/valid-parentheses/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/" target='_blank'>https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/" target='_blank'>https://leetcode.com/problems/remove-all-adjacent-duplicates-in-string-ii/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/removing-stars-from-a-string/" target='_blank'>https://leetcode.com/problems/removing-stars-from-a-string/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/next-greater-element-i/" target='_blank'>https://leetcode.com/problems/next-greater-element-i/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/next-greater-element-ii/" target='_blank'>https://leetcode.com/problems/next-greater-element-ii/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/daily-temperatures/" target='_blank'>https://leetcode.com/problems/daily-temperatures/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/trapping-rain-water/" target='_blank'>https://leetcode.com/problems/trapping-rain-water/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/top-k-frequent-elements/" target='_blank'>https://leetcode.com/problems/top-k-frequent-elements/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/queue-data-structure/" target='_blank'>https://www.geeksforgeeks.org/queue-data-structure/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/array-implementation-of-queue-simple/" target='_blank'>https://www.geeksforgeeks.org/array-implementation-of-queue-simple/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/implement-queue-using-stacks" target='_blank'>https://leetcode.com/problems/implement-queue-using-stacks</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/implement-stack-using-queues" target='_blank'>https://leetcode.com/problems/implement-stack-using-queues</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/kth-largest-element-in-an-array/" target='_blank'>https://leetcode.com/problems/kth-largest-element-in-an-array/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://takeuforward.org/data-structure/kth-largest-smallest-element-in-an-array/" target='_blank'>https://takeuforward.org/data-structure/kth-largest-smallest-element-in-an-array/</a></ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
            <h2 id="linked-list">Linked List:</h2>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/search-an-element-in-a-linked-list-iterative-and-recursive/" target='_blank'>https://www.geeksforgeeks.org/search-an-element-in-a-linked-list-iterative-and-recursive/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/find-length-of-a-linked-list-iterative-and-recursive/" target='_blank'>https://www.geeksforgeeks.org/find-length-of-a-linked-list-iterative-and-recursive/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/middle-of-the-linked-list" target='_blank'>https://leetcode.com/problems/middle-of-the-linked-list</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list" target='_blank'>https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/merge-two-sorted-lists" target='_blank'>https://leetcode.com/problems/merge-two-sorted-lists</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/palindrome-linked-list" target='_blank'>https://leetcode.com/problems/palindrome-linked-list</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/remove-nth-node-from-end-of-list" target='_blank'>https://leetcode.com/problems/remove-nth-node-from-end-of-list</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/remove-duplicates-from-sorted-list" target='_blank'>https://leetcode.com/problems/remove-duplicates-from-sorted-list</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/remove-linked-list-elements" target='_blank'>https://leetcode.com/problems/remove-linked-list-elements</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/delete-node-in-a-linked-list" target='_blank'>https://leetcode.com/problems/delete-node-in-a-linked-list</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/reverse-linked-list" target='_blank'>https://leetcode.com/problems/reverse-linked-list</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/swapping-nodes-in-a-linked-list" target='_blank'>https://leetcode.com/problems/swapping-nodes-in-a-linked-list</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/flatten-binary-tree-to-linked-list" target='_blank'>https://leetcode.com/problems/flatten-binary-tree-to-linked-list</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/odd-even-linked-list" target='_blank'>https://leetcode.com/problems/odd-even-linked-list</a></ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
            <h2 id="recursion">Recursion:</h2>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/introduction-to-recursion-data-structure-and-algorithm-tutorials/" target='_blank'>https://www.geeksforgeeks.org/introduction-to-recursion-data-structure-and-algorithm-tutorials/</a></ListGroup.Item>
                  <ListGroup.Item>Print 1 to 10 using recursion</ListGroup.Item>
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/java-program-for-factorial-of-a-number/" target='_blank'>https://www.geeksforgeeks.org/java-program-for-factorial-of-a-number/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/java-program-to-display-numbers-and-sum-of-first-n-natural-numbers/" target='_blank'>https://www.geeksforgeeks.org/java-program-to-display-numbers-and-sum-of-first-n-natural-numbers/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/fibonacci-number/" target='_blank'>https://leetcode.com/problems/fibonacci-number/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/combination-sum/" target='_blank'>https://leetcode.com/problems/combination-sum/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/combination-sum-ii/" target='_blank'>https://leetcode.com/problems/combination-sum-ii/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/subsets/" target='_blank'>https://leetcode.com/problems/subsets/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/subsets-ii/" target='_blank'>https://leetcode.com/problems/subsets-ii/</a></ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
            <h2 id="binary-tree">Trees: Binary Tree:</h2>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><a href="https://takeuforward.org/data-structure/strivers-tree-series-tree-data-structure/#point_1" target='_blank'>https://takeuforward.org/data-structure/strivers-tree-series-tree-data-structure/#point_1</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/binary-tree-preorder-traversal/" target='_blank'>https://leetcode.com/problems/binary-tree-preorder-traversal/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/binary-tree-inorder-traversal/" target='_blank'>https://leetcode.com/problems/binary-tree-inorder-traversal/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/binary-tree-postorder-traversal/" target='_blank'>https://leetcode.com/problems/binary-tree-postorder-traversal/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/search-a-node-in-binary-tree/" target='_blank'>https://www.geeksforgeeks.org/search-a-node-in-binary-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/sum-nodes-binary-tree/" target='_blank'>https://www.geeksforgeeks.org/sum-nodes-binary-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/second-minimum-node-in-a-binary-tree/" target='_blank'>https://leetcode.com/problems/second-minimum-node-in-a-binary-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/find-maximum-or-minimum-in-binary-tree/" target='_blank'>https://www.geeksforgeeks.org/find-maximum-or-minimum-in-binary-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/maximum-depth-of-binary-tree/" target='_blank'>https://leetcode.com/problems/maximum-depth-of-binary-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/balanced-binary-tree/" target='_blank'>https://leetcode.com/problems/balanced-binary-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/diameter-of-binary-tree/" target='_blank'>https://leetcode.com/problems/diameter-of-binary-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/same-tree/" target='_blank'>https://leetcode.com/problems/same-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/symmetric-tree/" target='_blank'>https://leetcode.com/problems/symmetric-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/binary-tree-maximum-path-sum/" target='_blank'>https://leetcode.com/problems/binary-tree-maximum-path-sum/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/" target='_blank'>https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/binary-tree-right-side-view/" target='_blank'>https://leetcode.com/problems/binary-tree-right-side-view/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/print-left-view-binary-tree/" target='_blank'>https://www.geeksforgeeks.org/print-left-view-binary-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/" target='_blank'>https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" target='_blank'>https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/" target='_blank'>https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/binary-tree-level-order-traversal/" target='_blank'>https://leetcode.com/problems/binary-tree-level-order-traversal/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/binary-tree-level-order-traversal-ii/" target='_blank'>https://leetcode.com/problems/binary-tree-level-order-traversal-ii/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/" target='_blank'>https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/</a></ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
            <h2 id="binary-search-tree">Binary Search Tree:</h2>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><a href="https://leetcode.com/problems/search-in-a-binary-search-tree/" target='_blank'>https://leetcode.com/problems/search-in-a-binary-search-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://practice.geeksforgeeks.org/problems/minimum-element-in-bst/1" target='_blank'>https://practice.geeksforgeeks.org/problems/minimum-element-in-bst/1</a></ListGroup.Item>
                  <ListGroup.Item>Maximum element in BST</ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/insert-into-a-binary-search-tree/" target='_blank'>https://leetcode.com/problems/insert-into-a-binary-search-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/delete-node-in-a-bst/" target='_blank'>https://leetcode.com/problems/delete-node-in-a-bst/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/range-sum-of-bst" target='_blank'>https://leetcode.com/problems/range-sum-of-bst</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/increasing-order-search-tree" target='_blank'>https://leetcode.com/problems/increasing-order-search-tree</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/kth-smallest-element-in-a-bst/" target='_blank'>https://leetcode.com/problems/kth-smallest-element-in-a-bst/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/validate-binary-search-tree/" target='_blank'>https://leetcode.com/problems/validate-binary-search-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" target='_blank'>https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/" target='_blank'>https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/inorder-successor-in-bst/" target='_blank'>https://leetcode.com/problems/inorder-successor-in-bst/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/two-sum-iv-input-is-a-bst/" target='_blank'>https://leetcode.com/problems/two-sum-iv-input-is-a-bst/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/balance-a-binary-search-tree" target='_blank'>https://leetcode.com/problems/balance-a-binary-search-tree</a></ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
            <h2 id="dynamic-programming">Dynamic Programming:</h2>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><a href="https://leetcode.com/problems/climbing-stairs/" target='_blank'>https://leetcode.com/problems/climbing-stairs/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/min-cost-climbing-stairs/" target='_blank'>https://leetcode.com/problems/min-cost-climbing-stairs/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/house-robber/" target='_blank'>https://leetcode.com/problems/house-robber/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/" target='_blank'>https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/coin-change/" target='_blank'>https://leetcode.com/problems/coin-change/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/coin-change-2/" target='_blank'>https://leetcode.com/problems/coin-change-2/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/unique-paths/" target='_blank'>https://leetcode.com/problems/unique-paths/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" target='_blank'>https://leetcode.com/problems/best-time-to-buy-and-sell-stock/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/" target='_blank'>https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/description/" target='_blank'>https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/description/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/" target='_blank'>https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/</a></ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
            <h2 id="binary-search">Binary Search:</h2>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><a href="https://www.geeksforgeeks.org/binary-search/" target='_blank'>https://www.geeksforgeeks.org/binary-search/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/binary-search/" target='_blank'>https://leetcode.com/problems/binary-search/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/search-insert-position/" target='_blank'>https://leetcode.com/problems/search-insert-position/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/search-a-2d-matrix/" target='_blank'>https://leetcode.com/problems/search-a-2d-matrix/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/sqrtx/" target='_blank'>https://leetcode.com/problems/sqrtx/</a></ListGroup.Item>
                  <ListGroup.Item><a href="https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/" target='_blank'>https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/</a></ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <ScrollToTopButton/>
      </Container>
    </div>
  );
};

export default Course;
