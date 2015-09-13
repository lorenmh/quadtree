var MAX_CHILDREN = 10
;

// point is any object that has an x / y coord

// Node is a bounded object
// x1, y1 === top left bounding point
// x2, y2 === bottom right bounding point
function Bounds( x1, y1, x2, y2 ) {
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
}

Bounds.prototype.containsPoint = function( x, y ) {
  return ( x >= this.x1 && x < this.x2 && y >= this.y1 && y < this.y2 );
};

Bounds.prototype.contains = function( bounds ) {
  return (
    this.containsPoint( bounds.x1, bounds.y1 ) ||
    this.containsPoint( bounds.x2, bounds.y2 )
  );
};

function QuadLeaf( bounds ) {
  this.bounds = bounds;

  this.children = [];
}

QuadLeaf.prototype.addChild = function( child ) {
  this.children.push( child );
};

QuadLeaf.prototype.toTree = function() {
  var midX, midY, bounds1, bounds2, bounds3, bounds4, children, quadLeaf1,
      quadLeaf2, quadLeaf3, quadLeaf4
  ;
  
  midX = ( this.bounds.x1 + this.bounds.x2 ) / 2;
  midY = ( this.bounds.y1 + this.bounds.y2 ) / 2;
  
  // bounds for node1
  bounds1 = new Bounds(
    this.bounds.x1,
    this.bounds.y1,
    midX,
    midY
  );

  // bounds for node2
  bounds2 = new Bounds(
    midX,
    this.bounds.y1,
    this.bounds.x2,
    midY
  );

  bounds3 = new Bounds(
    this.bounds.x1,
    midY,
    midX,
    this.bounds.y2
  );

  bounds4 = new Bounds(
    midX,
    midY,
    this.bounds.x2,
    this.bounds.y2
  );

  quadLeaf1 = new QuadLeaf( bounds1 );
  quadLeaf2 = new QuadLeaf( bounds2 );
  quadLeaf3 = new QuadLeaf( bounds3 );
  quadLeaf4 = new QuadLeaf( bounds4 );

  this.children.forEach( function( child ) {
    if (
        quadLeaf1.bounds.contains( child.bounds ) ||
        child.bounds.contains( quadLeaf1.bounds )
      ) {
      quadLeaf1.addChild( child );
    }

    if (
        quadLeaf2.bounds.contains( child.bounds ) ||
        child.bounds.contains( quadLeaf2.bounds )
      ) {
      quadLeaf2.addChild( child );
    }

    if (
        quadLeaf3.bounds.contains( child.bounds ) ||
        child.bounds.contains( quadLeaf3.bounds )
      ) {
      quadLeaf3.addChild( child );
    }

    if (
        quadLeaf4.bounds.contains( child.bounds ) ||
        child.bounds.contains( quadLeaf4.bounds )
      ) {
      quadLeaf4.addChild( child );
    }
  });

};

// node positions:
//
// node1 | node2
// ------|------
// node3 | node4
function QuadTree( bounds, node1, node2, node3, node4 ) {
  this.bounds = bounds;

  this.node1 = node1;
  this.node2 = node2;
  this.node3 = node3;
  this.node4 = node4;
}

// we assume that the point is within the QuadTree bounds
QuadTree.prototype.insert = function( point ) {

};
