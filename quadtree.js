var MAX_CHILDREN = 10
;

// point is any object that has an x / y coord

// quadLeaf is a bounded object
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

function QuadLeaf( bounds, parent ) {
  this.bounds = bounds;
  this.parent = parent;

  this.children = [];
}

QuadLeaf.prototype.addChild = function( child ) {
  this.children.push( child );
};

QuadLeaf.prototype.toTree = function() {
  var midX, midY, bounds1, bounds2, bounds3, bounds4, children, quadLeaf1,
      quadLeaf2, quadLeaf3, quadLeaf4, quadTree
  ;
  
  midX = ( this.bounds.x1 + this.bounds.x2 ) / 2;
  midY = ( this.bounds.y1 + this.bounds.y2 ) / 2;
  
  // bounds for quadLeaf1
  bounds1 = new Bounds(
    this.bounds.x1,
    this.bounds.y1,
    midX,
    midY
  );

  // bounds for quadLeaf2
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

  quadTree = new QuadTree(
    this.bounds,
    undefined,
    quadLeaf1,
    quadLeaf2,
    quadLeaf3,
    quadLeaf4
  );

  quadTree.parent = this.parent;

  quadLeaf1.parent = quadTree;
  quadLeaf2.parent = quadTree;
  quadLeaf3.parent = quadTree;
  quadLeaf4.parent = quadTree;

  return quadTree;
};

// quadLeaf positions:
//
// quadLeaf1 | quadLeaf2
// ----------|----------
// quadLeaf3 | quadLeaf4
function QuadTree(  bounds, parent, quadLeaf1,
                    quadLeaf2, quadLeaf3, quadLeaf4 ) {
  this.bounds = bounds;
  this.parent = parent;

  this.quadLeaf1 = quadLeaf1;
  this.quadLeaf2 = quadLeaf2;
  this.quadLeaf3 = quadLeaf3;
  this.quadLeaf4 = quadLeaf4;
}

// we assume that the point is within the QuadTree bounds
QuadTree.prototype.insert = function( point ) {

};
