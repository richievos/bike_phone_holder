///////////////////////////////////////////////////////
// utilities

// redefining this
function copy_mirror(vec)
{
  elements = arguments[1, arguments.length - 1];
  return union(elements, mirror(vec, elements));
} 

function other_side(s1, s2) {
  return sqrt(s1 * s1 + s2 * s2);
}

function fetch(object, key, defaultVal) {
  return object.hasOwnProperty(key) ? object[key] : defaultVal;
}

function cube_cylinder_rounded(options) {
  var size = options["size"];
  var center = fetch(options, "center", false)
  var corner_roundness_factor = fetch(options, "corner_roundness_factor", 4);
  // intersection() {
  //   cube(size = [attachment_square_width, attachment_square_width, just_bottom_catcher_thickness + attachment_square_height], center=true);
  //   cylinder(r = (corner_to_corner_attachment_square_distance/2) - corner_roundness_factor, h=just_bottom_catcher_thickness + attachment_square_height, $fn=200, center=true);
  // }

  corner_to_corner_distance = other_side(size[0], size[1]);

  return intersection(
    cube({size: size, center: center}),
    cylinder({r: (corner_to_corner_distance/2) - corner_roundness_factor, h: size[2], resolution: 200, center: center})
  );
}


//
// Simple and fast corned cube!
// Anaximandro de Godinho.
//

function cubeX(options)
{
  var size = options["size"],
      radius = fetch(options, "radius", 1),
      rounded = fetch(options, "rounded", true),
      center = fetch(options, "center", false);
  return cube(options);
  if (typeof size == "number")
    return _cubeX( size, size, size, radius, rounded, center );
  else
    return _cubeX( size[0], size[1], size[2], radius, rounded, center );
}

function _cubeX( x, y, z, r, rounded, center )
{
  if( rounded )
    if( center )
      return translate([-x/2, -y/2, -z/2],
                       __cubeX( x, y, z, r ));
    else
      return __cubeX( x, y, z, r );
  else
    return cube({size: [x, y, z], center: center});
}

function __cubeX( x, y, z, r )
{
  //TODO: discount r.
  rC = r;
  return hull(
    translate( [rC, rC, rC], circle( r )),
    translate( [rC, y-rC, rC], circle( r )),
    translate( [rC, rC, z-rC], circle( r )),
    translate( [rC, y-rC, z-rC], circle( r )),

    translate( [x-rC, rC, rC], circle( r )),
    translate( [x-rC, y-rC, rC], circle( r )),
    translate( [x-rC, rC, z-rC], circle( r )),
    translate( [x-rC, y-rC, z-rC], circle( r ))
  )
}
///////////////////////////////////////////////////////
// design
function holder_box(phone_length, phone_width, phone_height, catcher_thickness, top_catcher_overlap,
                  side_thickness, side_gap_height, side_gap_width, side_gap_top_distance,
                  corner_roundness_factor) {
  corner_roundness_factor = corner_roundness_factor || 1;

  // aka hypotenuse
  corner_to_corner_distance = other_side(phone_length, phone_width);

  // the box
  return difference(
    cube({size: [phone_length + side_thickness, phone_width + side_thickness, phone_height + catcher_thickness], center: true}),
    cube({size: [phone_length, phone_width, phone_height], center: true}),

    // cut out the chunk along the length
    cube({size: [phone_length - top_catcher_overlap, phone_width, phone_height + catcher_thickness + 2], center: true}),
    // cut out the chunk along the width
    cube({size: [phone_length, phone_width - top_catcher_overlap, phone_height + catcher_thickness + 2], center: true})
  )
}

function zip_tie_tunnel(width, length, height) {
  return cube({size: [width, length, height], center: true});
}

function width_support(bottom_support_width, phone_width, side_thickness, just_bottom_catcher_thickness) {
  return cube({size: [bottom_support_width, phone_width + side_thickness, just_bottom_catcher_thickness], center: true});
}

function bottom_supports(phone_length, phone_width, phone_height, side_thickness, catcher_thickness, bottom_support_width,
                       attachment_square_width,
                       attachment_square_height,
                       ziptie_height,
                       ziptie_width,
                       corner_roundness_factor) {
  corner_roundness_factor = corner_roundness_factor || 4;
  just_bottom_catcher_thickness = catcher_thickness / 2;

  translate_to_top = phone_height * 1/2 + just_bottom_catcher_thickness * 1/2;

  return union(
    // center cross
    translate([0, 0, translate_to_top],
      // wall to wall section
      width_support(bottom_support_width, phone_width, side_thickness, just_bottom_catcher_thickness),

      // bottom attachment square
      difference(
        translate([0, 0, attachment_square_height/2],
          cube_cylinder_rounded({size: [attachment_square_width, attachment_square_width, just_bottom_catcher_thickness + attachment_square_height],
                                          center: true,
                                          corner_roundness_factor: corner_roundness_factor})
        ),

        // 4 zip tie tunnels
        copy_mirror([1, 1, 0],
          copy_mirror([1, 0, 0],
            translate([attachment_square_width * 1/4, 0, attachment_square_height * 3/4],
                      zip_tie_tunnel(ziptie_width, attachment_square_width + 4, ziptie_height)
            )
          )
        )
      ),

      // the cross-bar
      rotate([0, 0, 90],
        cubeX({size: [bottom_support_width, 2 * phone_length / 3 + bottom_support_width, just_bottom_catcher_thickness], center: true})
      )
    ),

    translate([phone_length * -1/3, 0, translate_to_top],
      width_support(bottom_support_width, phone_width, side_thickness, just_bottom_catcher_thickness)
    ),

    translate([phone_length * 1/3, 0, translate_to_top],
      width_support(bottom_support_width, phone_width, side_thickness, just_bottom_catcher_thickness)
    )
  )
}

function phone_holder(
  phone_length,
  phone_width,
  phone_height,

  side_thickness,

  catcher_thickness,
  top_catcher_overlap,


  side_gap_top_distance,
  catcher_thickness,

  side_gap_height,
  side_gap_width,

  bottom_support_count,
  bottom_support_width,

  attachment_square_width,
  attachment_square_height,

  ziptie_height,
  ziptie_width
  ) {

  return union(
        holder_box(phone_length,
                   phone_width,
                   phone_height,
                   catcher_thickness,
                   top_catcher_overlap,
                   side_thickness,
                   side_gap_height,
                   side_gap_width,
                   side_gap_top_distance
        ),
        bottom_supports(phone_length, phone_width, phone_height, side_thickness, catcher_thickness, bottom_support_width,
                        attachment_square_width,
                        attachment_square_height,
                        ziptie_height,
                        ziptie_width)
      );
}

function main() {
  phone_length = 143.5;
  phone_width = 73.3;
  phone_height = 11.2;

  side_thickness = 6;

  catcher_thickness = 5;
  top_catcher_overlap = 20;


  side_gap_top_distance = 4;
  catcher_thickness = side_thickness;

  side_gap_height = 2;
  side_gap_width = 50;

  bottom_support_count = 3;
  bottom_support_width = 10;

  attachment_square_width = 30;
  attachment_square_height = 20;

  ziptie_height = 2;
  ziptie_width = 5;

  return intersection(
      phone_holder(
        phone_length,
        phone_width,
        phone_height,

        side_thickness,

        catcher_thickness,
        top_catcher_overlap,


        side_gap_top_distance,
        catcher_thickness,

        side_gap_height,
        side_gap_width,

        bottom_support_count,
        bottom_support_width,

        attachment_square_width,
        attachment_square_height,

        ziptie_height,
        ziptie_width
      ) //,

      // // Printer's too small, cut the model in half
      // translate([phone_length/2, 0, 0],
      //   cube({size: [phone_length, 1000, 1000], center: true})
      // )
    )
}

