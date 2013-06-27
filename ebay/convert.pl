#!/usr/bin/perl

use lib "/httpd/modules";
use TOXML;
use Data::Dumper;
use File::Copy;
use TEMPLATE::KISS;

opendir $D, "/httpd/static/wizards";
while ( my $dir = readdir($D) ) {
	next if (! -d "/httpd/static/wizards/$dir");

	next if ($dir eq 'fissure');
	next if ($dir eq 'all_fields');
	next if ($dir eq 'evolution');

	next if (substr($dir,0,1) eq '.');
	print "DIR: $dir\n";

	&TEMPLATE::KISS::upgradeLegacy(undef,$dir);
	}
closedir $D;


__DATA__


	my @PREVIEWS = ();
	foreach my $file (
		"/httpd/static/wizards/$dir/$dir.png",
		"/httpd/static/wizards/$dir/$dir\_a.png",
		"/httpd/static/wizards/$dir/$dir\_b.png",
		"/httpd/static/wizards/$dir/$dir\_c.png",
		"/httpd/static/wizards/$dir/$dir\_d.png",
		"/httpd/static/wizards/$dir/$dir\_e.png",
		"/httpd/static/wizards/$dir/$dir\_f.png"
		) {
		if (-f "$file") { push @PREVIEWS, $file; }
		}

	# next if (-d "/httpd/static/templates/ebay/$dir");

	next if (scalar(@PREVIEWS)==0);
	print "DIR: $dir\n";

	my ($t) = TOXML->new('WIZARD',$dir);
	next if ($t->{'_ID'} eq '');

	# print Dumper($t);

	next if ($dir eq 'fissure');
	next if ($dir eq 'all_fields');

	mkdir "/httpd/static/templates/ebay/$dir";
	chmod 0777, "/httpd/static/templates/ebay/$dir";

	my $i = 0;
	foreach my $file (@PREVIEWS) {
		if ($i==0) {
			File::Copy::copy($file,"/httpd/static/templates/ebay/$dir/preview.png");
			}
		else {
			File::Copy::copy($file,sprintf("/httpd/static/templates/ebay/$dir/preview-%d.png",$i));
			}
		$i++;
		}

	my $ELEMENTS = $t->{'_ELEMENTS'};

	my @NODES = ();
	$HTML = '';
	foreach my $node (@{$ELEMENTS}) {
		if ($node->{'TYPE'} eq 'OUTPUT') {
			$HTML .= $node->{'HTML'};
			}
		elsif ($node->{'TYPE'} eq 'CONFIG') {
			$HTML .= "<style type=\"text/css\">\n".$node->{'CSS'}."\n</style>";
			}
		}

	foreach my $node (@{$ELEMENTS}) {
		if ($node->{'TYPE'} eq 'OUTPUT') {
			}
		elsif ($node->{'TYPE'} eq 'CONFIG') {
			}
		elsif ($node->{'LOAD'} eq 'URL::WIZARD_URL') {
			}
		elsif ($node->{'LOAD'} eq 'URL::GRAPHICS_URL') {
			}
		elsif ($node->{'LOAD'} eq 'URL::IMAGE_URL') {
			}
		elsif ($node->{'LOAD'} eq 'MARKETPLACE::CHECKOUT_URL') {
			}
		elsif ($node->{'TYPE'} eq 'READONLY') {
			if ($node->{'DATA'} eq 'FLOW::SKU') {
				}
			elsif ($node->{'DATA'} eq 'FLOW::PROD') {
				}
			elsif ($node->{'DATA'} eq 'FLOW::USERNAME') {
				}
			elsif ($node->{'LOAD'} eq 'URL::CHECKOUT') {
				}
			elsif ($node->{'DATA'} eq 'URL::WIZARD_URL') {
				}
			elsif ($node->{'DATA'} =~ /^merchant:/) {
				warn "IGNORING: ".Dumper($node)."\n";
				}
			elsif ($node->{'LOAD'} eq 'profile:zoovy:popup_wrapper') {
				warn "IGNORING: ".Dumper($node)."\n";
				}
			elsif ($node->{'LOAD'} =~ /^merchant:/) {
				warn "IGNORING: ".Dumper($node)."\n";
				}
			else {
				print 'UNKNOWN ELEMENTS: '.Dumper($node);
				die();
				}
			}
		elsif ($node->{'DATA'} =~ /^product:(.*?)$/) {
			if ($node->{'SUB'}) {
				$node->{'DATA'} = $1;
				$node->{'OBJECT'} = 'product';
				my $SUB = '%'.$node->{'SUB'}.'%';

				$node->{'ID'} = $node->{'SUB'};  delete $node->{'SUB'};
		
				$node->{'ATTRIB'} = $node->{'DATA'}; delete $node->{'DATA'};
				$node->{'TITLE'} = $node->{'PROMPT'}; delete $node->{'PROMPT'};

				push @NODES, $node;

				if ($node->{'TYPE'} eq 'IMAGE') {
					## ??
					my $SUBWITH = '';
					my $ZOOMWITH = '';
					my $ZOOM = 0;
					foreach my $k (keys %{$node}) {
						my $v = &ZOOVY::incode($node->{$k});
						my $attrib = '';
						if ($k eq 'ZOOM') {
							$ZOOM++;
							}
						elsif ($k eq 'ID') {
							$attrib = 'id';
							}
						elsif ($k eq 'OBJECT') {
							$attrib = 'data-object';
							}
						elsif ($k eq 'TYPE') {
							# $attrib = 'data-type';
							$attrib = '';
							$SUBWITH .= lc(" data-type=\"IMAGE\" ");
							$ZOOMWITH .= lc(" data-type=\"IMAGELINK\" ");
							}
						elsif (($k eq 'HEIGHT') || ($k eq 'WIDTH')) {
							$SUBWITH .= lc(" data-input-$k=\"$v\" ");
							$ZOOMWITH .= lc(" data-input-$k=\"0\" ");
							$attrib = '';
							}
						elsif ($k eq 'ATTRIB') {
							$attrib = "data-attrib";
							}
						else {
							$attrib = lc("data-input-$k");
							}

						if ($attrib ne '') {
							$SUBWITH .= " $attrib=\"$v\"";
							$ZOOMWITH .= " $attrib=\"$v\"";
							}
						}

					if ($ZOOM) {
						$SUBWITH = "<a id=\"link_$node->{'ID'}\" $ZOOMWITH href=\"#\">\n<img $SUBWITH />\n</a>";
						}
					else {
						$SUBWITH = "<img $SUBWITH />";
						}
					$HTML =~ s/$SUB/$SUBWITH/gs;					
					}
				else {
					my $SUBWITH = qq~<span ~;
					foreach my $k (keys %{$node}) {
						my $v = &ZOOVY::incode($node->{$k});
						my $attrib = '';
						if ($k eq 'ID') {
							$attrib = 'id';
							}
						elsif ($k eq 'OBJECT') {
							$attrib = 'data-object';
							}
						elsif ($k eq 'ATTRIB') {
							$attrib = "data-attrib";
							}
						else {
							$attrib = lc("data-input-$k");
							}
						$SUBWITH .= " $attrib=\"$v\"";
						}
					$SUBWITH .= ">$node->{'TITLE'}</span>";
					print "$SUB --- $SUBWITH\n";
					$HTML =~ s/$SUB/$SUBWITH/gs;	
					}

				}	
			else {
				print STDERR "NON-SUBBED INPUT: ".Dumper($node);
				}
			}
		elsif ($node->{'DATA'} =~ /^(merchant|profile):(.*?)$/) {
			print 'IGNORING: '.Dumper($node);
			}
		elsif (($dir eq 'warlock') || ($dir eq 'multiplain') || ($dir eq 'series3-gelflex') || ($dir eq 'isotope') || ($dir eq 'sirius') || ($dir eq 'neutron') || ($dir eq 'evolution') || ($dir eq 'brandx')) {
			}
		else {
			print Dumper($dir,$node);
			die();
			}
		}


	my $NEW = '';
	foreach my $CHUNK ( split(/(\/\/static\.zoovy\.com.*?(jpg|png|gif))/, $HTML) ) {
		if ($CHUNK =~ /^(jpg|png|gif)$/) {
			}
		elsif (substr($CHUNK,0,2) eq '//') {
			print "CHUNK: $CHUNK\n";
			if ($CHUNK =~ /^\/\/static\.zoovy\.com\/graphics\/wizards\/(.*?)\/(.*?)$/) {
				print "/httpd/static/templates/ebay/$dir/$2\n";
				$CHUNK = $2;
				File::Copy::copy("/httpd/static/graphics/wizards/$1/$2","/httpd/static/templates/ebay/$dir/$2");
				}
			elsif ($CHUNK =~ /^\/\/static\.zoovy\.com\/graphics\/gfx\/wizards\/(.*?)\/(.*?)$/) {
				print "/httpd/static/templates/ebay/$dir/$2\n";
				$CHUNK = $2;
				File::Copy::copy("/httpd/static/graphics/gfx/wizards/$1/$2","/httpd/static/templates/ebay/$dir/$2");
				}
			elsif ($CHUNK =~ /^\/\/static\.zoovy\.com\/graphics\/wrappers\/(.*?)\/(.*?)$/) {
				## //static.zoovy.com/graphics/wrappers/baggy/body_left_bg.gif
				print "/httpd/static/templates/ebay/$dir/$2\n";
				$CHUNK = $2;
				File::Copy::copy("/httpd/static/graphics/wrappers/$1/$2","/httpd/static/templates/ebay/$dir/$2");
				}
			elsif ($CHUNK =~ /^\/\/static\.zoovy\.com\/graphics\/general\/([a-z0-9\.]+)$/) {
				print "/httpd/static/templates/ebay/$dir/$2\n";
				$CHUNK = $1;
				File::Copy::copy("/httpd/static/graphics/$1","/httpd/static/templates/ebay/$dir/$1");
				}
			else {
				die($CHUNK);
				}
			$NEW .= "$CHUNK";
			}
		else {
			$NEW .= $CHUNK;
			}
		}
	$HTML = $NEW;

	open Findex, ">/httpd/static/templates/ebay/$dir/index.html";
	print Findex "$HTML";
	close Findex;

	open Finput, ">/httpd/static/templates/ebay/$dir/input.json";
	my $coder = JSON::XS->new->ascii->pretty->allow_nonref;
	$pretty_printed_unencoded = $coder->encode (\@NODES);
	print Finput $pretty_printed_unencoded;
	close Finput;

	# JSON::Syck::DumpFile("/httpd/static/templates/ebay/$dir/input.json", \@NODES);
#	die();
	}
closedir $D;

