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

QuadLeaf.prototype.intersects = function( obj ) {
  return (
    this.bounds.contains( obj.bounds ) ||
    obj.bounds.contains( this.bounds )
  );
};

QuadLeaf.prototype.insert = function( child ) {
  this.children.push( child );
};

QuadLeaf.prototype.toTree = function() {
  var midX, midY, bounds1, bounds2, bounds3, bounds4, children, quadLeaf1,
      quadLeaf2, quadLeaf3, quadLeaf4, quadNode
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
    if ( quadLeaf1.intersect( child ) ) {
      quadLeaf1.insert( child );
    }

    if ( quadLeaf2.intersect( child ) ) {
      quadLeaf2.insert( child );
    }

    if ( quadLeaf3.intersect( child ) ) {
      quadLeaf3.insert( child );
    }

    if ( quadLeaf4.intersect( child ) ) {
      quadLeaf4.insert( child );
    }
  });

  quadNode = new QuadNode(
    this.bounds,
    undefined,
    quadLeaf1,
    quadLeaf2,
    quadLeaf3,
    quadLeaf4
  );

  quadNode.parent = this.parent;

  quadLeaf1.parent = quadNode;
  quadLeaf2.parent = quadNode;
  quadLeaf3.parent = quadNode;
  quadLeaf4.parent = quadNode;

  return quadNode;
};

// quadLeaf positions:
//
// quadLeaf1 | quadLeaf2
// ----------|----------
// quadLeaf3 | quadLeaf4
function QuadNode(  bounds, parent,
                    node1, node2, node3, node4 ) {
  this.bounds = bounds;
  this.parent = parent;

  this.node1 = node1;
  this.node2 = node2;
  this.node3 = node3;
  this.node4 = node4;
}

QuadNode.prototype.intersects = function( obj ) {
  return (
    this.bounds.contains( obj.bounds ) ||
    obj.bounds.contains( this.bounds )
  );
};

// we assume that the point is within the QuadNode bounds
QuadNode.prototype.insert = function( obj ) {
  if ( this.node1.intersects( obj ) ) {
    this.node1.insert( obj );
    if (  this.node1 instanceof QuadLeaf &&
          this.node1.children.length > MAX_CHILDREN ) {
      this.node1 = this.node1.toTree();
    }
  }

  if ( this.node2.intersects( obj ) ) {
    this.node2.insert( obj );
    if (  this.node2 instanceof QuadLeaf &&
          this.node2.children.length > MAX_CHILDREN ) {
      this.node2 = this.node2.toTree();
    }
  }

  if ( this.node3.intersects( obj ) ) {
    this.node3.insert( obj );
    if (  this.node3 instanceof QuadLeaf &&
          this.node3.children.length > MAX_CHILDREN ) {
      this.node3 = this.node3.toTree();
    }
  }

  if ( this.node4.intersects( obj ) ) {
    this.node4.insert( obj );
    if (  this.node4 instanceof QuadLeaf &&
          this.node4.children.length > MAX_CHILDREN ) {
      this.node4 = this.node4.toTree();
    }
  }
};
