// ///////////////////////////////////////////////////////
// // utilities
// module copy_mirror(vec=[0,1,0]) 
// { 
//     children(); 
//     mirror(vec) children(); 
// } 

// function other_side(s1, s2) = sqrt(s1 * s1 + s2 * s2);

// //
// // Simple and fast corned cube!
// // Anaximandro de Godinho.
// //

// module cube_cylinder_rounded(size, center=false, corner_roundness_factor) {
//   // intersection() {
//   //   cube(size = [attachment_square_width, attachment_square_width, just_bottom_catcher_thickness + attachment_square_height], center=true);
//   //   cylinder(r = (corner_to_corner_attachment_square_distance/2) - corner_roundness_factor, h=just_bottom_catcher_thickness + attachment_square_height, $fn=200, center=true);
//   // }

//   corner_to_corner_distance = other_side(size[0], size[1]);

//   intersection() {
//     cube(size = size, center=center);
//     cylinder(r = (corner_to_corner_distance/2) - corner_roundness_factor, h=size[2], $fn=200, center=center);
//   }
// }

// module cubeX( size, radius=1, rounded=true, center=false )
// {
//   l = len( size );
//   if( l == undef )
//     _cubeX( size, size, size, radius, rounded, center );
//   else
//     _cubeX( size[0], size[1], size[2], radius, rounded, center );
// }

// module _cubeX( x, y, z, r, rounded, center )
// {
//   if( rounded )
//     if( center )
//       translate( [-x/2, -y/2, -z/2] )
//       __cubeX( x, y, z, r );
//     else
//       __cubeX( x, y, z, r );
//   else
//     cube( [x, y, z], center );
// }

// module __cubeX( x, y, z, r )
// {
//   //TODO: discount r.
//   rC = r;
//   hull()
//   {
//     translate( [rC, rC, rC] )
//       sphere( r );
//     translate( [rC, y-rC, rC] )
//       sphere( r );
//     translate( [rC, rC, z-rC] )
//       sphere( r );
//     translate( [rC, y-rC, z-rC] )
//       sphere( r );

//     translate( [x-rC, rC, rC] )
//       sphere( r );
//     translate( [x-rC, y-rC, rC] )
//       sphere( r );
//     translate( [x-rC, rC, z-rC] )
//       sphere( r );
//     translate( [x-rC, y-rC, z-rC] )
//       sphere( r );
//   }
// }

// ///////////////////////////////////////////////////////
// // design
// module holder_box(phone_length, phone_width, phone_height, catcher_thickness, top_catcher_overlap,
//                   side_thickness, side_gap_height, side_gap_width, side_gap_top_distance,
//                   corner_roundness_factor = 1) {


//   // aka hypotenuse
//   corner_to_corner_distance = other_side(phone_length, phone_width);

//   // the box
//   difference() {
//     cubeX(size = [phone_length + side_thickness, phone_width + side_thickness, phone_height + catcher_thickness], center = true);
//     cubeX(size = [phone_length, phone_width, phone_height], center = true);

//     // cut out the chunk along the length
//     cubeX(size = [phone_length - top_catcher_overlap, phone_width, phone_height + catcher_thickness + 2], center = true);
//     // cut out the chunk along the width
//     cubeX(size = [phone_length, phone_width - top_catcher_overlap, phone_height + catcher_thickness + 2], center = true);

//     // cut out a gap 
//     translate([-phone_length / 2 + 20, 0, -side_gap_top_distance]) {
//       cube(size = [side_gap_width, phone_width + side_thickness + 2, side_gap_height ], center = true);
//     }
//   }
// }

// module zip_tie_tunnel(width, length, height) {
//   cube(size = [width, length, height], center=true);
// }

// module width_support(bottom_support_width, phone_width, side_thickness, just_bottom_catcher_thickness) {
//   cubeX(size = [bottom_support_width, phone_width + side_thickness, just_bottom_catcher_thickness], center = true);
// }

// module bottom_supports(phone_length, phone_width, phone_height, side_thickness, catcher_thickness, bottom_support_width,
//                        attachment_square_width,
//                        attachment_square_height,
//                        ziptie_height,
//                        ziptie_width,
//                        corner_roundness_factor = 4) {
//   just_bottom_catcher_thickness = catcher_thickness / 2;

//   translate_to_top = phone_height * 1/2 + just_bottom_catcher_thickness * 1/2;

//   union() {
//     // center cross
//     translate([0, 0, translate_to_top]) {
//       // wall to wall section
//       width_support(bottom_support_width, phone_width, side_thickness, just_bottom_catcher_thickness);

//       // bottom attachment square
//       difference() {
//         translate([0, 0, attachment_square_height/2]) {
//           cube_cylinder_rounded(size = [attachment_square_width, attachment_square_width, just_bottom_catcher_thickness + attachment_square_height],
//                                 center = true,
//                                 corner_roundness_factor = corner_roundness_factor);
//         }

//         // 4 zip tie tunnels
//         copy_mirror([1, 1, 0]) {
//           copy_mirror([1, 0, 0]) {
//             translate([attachment_square_width * 1/4, 0, attachment_square_height * 3/4]) {
//               zip_tie_tunnel(ziptie_width, attachment_square_width + 4, ziptie_height);
//             }
//           }
//         }
//       }

//       // the cross-bar
//       rotate([0, 0, 90]) {
//         cubeX(size = [bottom_support_width, 2 * phone_length / 3 + bottom_support_width, just_bottom_catcher_thickness], center = true);
//       }
//     }

//     translate([phone_length * -1/3, 0, translate_to_top]) {
//       width_support(bottom_support_width, phone_width, side_thickness, just_bottom_catcher_thickness);
//     }

//     translate([phone_length * 1/3, 0, translate_to_top]) {
//       width_support(bottom_support_width, phone_width, side_thickness, just_bottom_catcher_thickness);
//     }
//   }
// }

// phone_length = 143.5;
// phone_width = 73.3;
// phone_height = 11.2;

// side_thickness = 6;

// catcher_thickness = 5;
// top_catcher_overlap = 20;


// side_gap_top_distance = 4;
// catcher_thickness = side_thickness;

// side_gap_height = 2;
// side_gap_width = 50;

// bottom_support_count = 3;
// bottom_support_width = 10;

// attachment_square_width = 30;
// attachment_square_height = 20;

// ziptie_height = 2;
// ziptie_width = 5;

// intersection() {
//   union() {
//     holder_box(phone_length,
//                phone_width,
//                phone_height,
//                catcher_thickness,
//                top_catcher_overlap,
//                side_thickness,
//                side_gap_height,
//                side_gap_width,
//                side_gap_top_distance
//     );
//     bottom_supports(phone_length, phone_width, phone_height, side_thickness, catcher_thickness, bottom_support_width,
//                     attachment_square_width,
//                     attachment_square_height,
//                     ziptie_height,
//                     ziptie_width);
//   }

//   // Printer's too small, cut the model in half
//   translate([phone_length/2, 0, 0]) {
//     cube(size = [phone_length, 1000, 1000], center=true);    
//   }
// }

module copy_mirror(vec=[0,1,0]) 
{ 
    children(); 
    mirror(vec) children(); 
} 

module build_cube() {
  translate([3, 0, 0]) {
    cube(size=[4, 2, 2], center=true);
  }
}

build_cube();
mirror([1, 0, 0]) {
  build_cube();
}
mirror([1, 1, 0]) {
  build_cube();
}
mirror([1, 1, 0]) {
  mirror([1, 0, 0]) {
    build_cube();
  }
}

// mirror([1, 0, 0]) {
//   build_cube();
// }
